import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EnvironmentConfig } from '../config/environment-config';

export interface EcsConstructProps {
  vpc: ec2.Vpc;
  config: EnvironmentConfig;
  acentraBackendRepository: ecr.Repository;
  authBackendRepository: ecr.Repository;
  dbSecret: secretsmanager.Secret;
  dbEndpoint: string;
  ecsSecurityGroup?: ec2.SecurityGroup; // Optional: use existing security group
}

export class EcsConstruct extends Construct {
  public readonly cluster: ecs.Cluster;
  public readonly acentraService: ecs.FargateService;
  public readonly authService: ecs.FargateService;
  public readonly alb: elbv2.ApplicationLoadBalancer;
  public readonly securityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props: EcsConstructProps) {
    super(scope, id);

    const { vpc, config, acentraBackendRepository, authBackendRepository, dbSecret, dbEndpoint, ecsSecurityGroup } = props;

    // Create ECS Cluster
    this.cluster = new ecs.Cluster(this, 'Cluster', {
      vpc,
      clusterName: `acentra-${config.environmentName}-cluster`,
      containerInsights: config.ecsConfig.enableContainerInsights,
    });

    // Use provided security group or create a new one
    this.securityGroup = ecsSecurityGroup || new ec2.SecurityGroup(this, 'EcsSecurityGroup', {
      vpc,
      description: `Security group for ECS tasks (${config.environmentName})`,
      allowAllOutbound: true,
    });

    // Create Application Load Balancer
    this.alb = new elbv2.ApplicationLoadBalancer(this, 'Alb', {
      vpc,
      internetFacing: true,
      loadBalancerName: `acentra-${config.environmentName}-alb`,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
    });

    // Create ALB security group
    const albSecurityGroup = new ec2.SecurityGroup(this, 'AlbSecurityGroup', {
      vpc,
      description: `Security group for ALB (${config.environmentName})`,
      allowAllOutbound: true,
    });

    albSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'Allow HTTP traffic'
    );

    albSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'Allow HTTPS traffic'
    );

    this.alb.addSecurityGroup(albSecurityGroup);

    // Allow ALB to reach ECS tasks
    this.securityGroup.addIngressRule(
      albSecurityGroup,
      ec2.Port.tcp(3001),
      'Allow traffic from ALB to Acentra Backend'
    );

    this.securityGroup.addIngressRule(
      albSecurityGroup,
      ec2.Port.tcp(3002),
      'Allow traffic from ALB to Auth Backend'
    );

    // Create Log Group
    const logGroup = new logs.LogGroup(this, 'LogGroup', {
      logGroupName: `/ecs/acentra-${config.environmentName}`,
      retention: config.ecsConfig.logRetentionDays as logs.RetentionDays,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // --- Auth Backend Service ---
    const authTaskDefinition = new ecs.FargateTaskDefinition(this, 'AuthTaskDef', {
      family: `auth-backend-${config.environmentName}`,
      cpu: config.ecsConfig.cpu,
      memoryLimitMiB: config.ecsConfig.memory,
    });

    dbSecret.grantRead(authTaskDefinition.taskRole);
    authTaskDefinition.taskRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLogsFullAccess'));

    const authContainer = authTaskDefinition.addContainer('AuthContainer', {
      image: ecs.ContainerImage.fromEcrRepository(authBackendRepository, 'latest'),
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'auth-backend', logGroup }),
      environment: {
        NODE_ENV: 'production',
        PORT: '3002',
        DB_HOST: dbEndpoint,
        DB_PORT: '5432',
        DB_NAME: 'acentra', // Assuming same DB for now, or update if using separate DB
        DB_SSL: 'true',
        JWT_SECRET: 'secret', // TODO: Use Secrets Manager
      },
      secrets: {
        DB_USERNAME: ecs.Secret.fromSecretsManager(dbSecret, 'username'),
        DB_PASSWORD: ecs.Secret.fromSecretsManager(dbSecret, 'password'),
      },
      healthCheck: {
        command: ['CMD-SHELL', 'curl -f http://localhost:3002/health || exit 1'],
        interval: cdk.Duration.seconds(30),
        timeout: cdk.Duration.seconds(5),
        retries: 3,
        startPeriod: cdk.Duration.seconds(60),
      },
    });

    authContainer.addPortMappings({ containerPort: 3002, protocol: ecs.Protocol.TCP });

    this.authService = new ecs.FargateService(this, 'AuthService', {
      cluster: this.cluster,
      taskDefinition: authTaskDefinition,
      serviceName: `auth-backend-${config.environmentName}-service`,
      desiredCount: config.ecsConfig.desiredCount,
      assignPublicIp: config.ecsConfig.usePublicSubnets,
      vpcSubnets: { subnetType: config.ecsConfig.usePublicSubnets ? ec2.SubnetType.PUBLIC : ec2.SubnetType.PRIVATE_ISOLATED },
      securityGroups: [this.securityGroup],
      healthCheckGracePeriod: cdk.Duration.seconds(60),
    });

    /*
    // --- Acentra Backend Service ---
    const acentraTaskDefinition = new ecs.FargateTaskDefinition(this, 'AcentraTaskDef', {
      family: `acentra-backend-${config.environmentName}`,
      cpu: config.ecsConfig.cpu,
      memoryLimitMiB: config.ecsConfig.memory,
    });

    dbSecret.grantRead(acentraTaskDefinition.taskRole);
    acentraTaskDefinition.taskRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLogsFullAccess'));

    const acentraContainer = acentraTaskDefinition.addContainer('AcentraContainer', {
      image: ecs.ContainerImage.fromEcrRepository(acentraBackendRepository, 'latest'),
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'acentra-backend', logGroup }),
      environment: {
        NODE_ENV: 'production',
        PORT: '3001',
        DB_HOST: dbEndpoint,
        DB_PORT: '5432',
        DB_NAME: 'acentra',
        DB_SSL: 'true',
        JWT_SECRET: 'secret', // TODO: Use Secrets Manager
        // Use the ALB DNS name for service-to-service communication
        // This ensures the backend can properly reach the auth service in the ECS environment
        AUTH_SERVICE_URL: `http://${this.alb.loadBalancerDnsName}`,
      },
      secrets: {
        DB_USERNAME: ecs.Secret.fromSecretsManager(dbSecret, 'username'),
        DB_PASSWORD: ecs.Secret.fromSecretsManager(dbSecret, 'password'),
      },
      healthCheck: {
        command: ['CMD-SHELL', 'curl -f http://localhost:3001/health || exit 1'],
        interval: cdk.Duration.seconds(30),
        timeout: cdk.Duration.seconds(5),
        retries: 3,
        startPeriod: cdk.Duration.seconds(60),
      },
    });

    acentraContainer.addPortMappings({ containerPort: 3001, protocol: ecs.Protocol.TCP });

    this.acentraService = new ecs.FargateService(this, 'AcentraService', {
      cluster: this.cluster,
      taskDefinition: acentraTaskDefinition,
      serviceName: `acentra-backend-${config.environmentName}-service`,
      desiredCount: config.ecsConfig.desiredCount,
      assignPublicIp: config.ecsConfig.usePublicSubnets,
      vpcSubnets: { subnetType: config.ecsConfig.usePublicSubnets ? ec2.SubnetType.PUBLIC : ec2.SubnetType.PRIVATE_ISOLATED },
      securityGroups: [this.securityGroup],
      healthCheckGracePeriod: cdk.Duration.seconds(60),
    });
    */

    // --- Load Balancer Routing ---

    const authTargetGroup = new elbv2.ApplicationTargetGroup(this, 'AuthTargetGroup', {
      vpc,
      port: 3002,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targetType: elbv2.TargetType.IP,
      healthCheck: { path: '/health' },
      deregistrationDelay: cdk.Duration.seconds(30),
    });
    this.authService.attachToApplicationTargetGroup(authTargetGroup);

    /*
    const acentraTargetGroup = new elbv2.ApplicationTargetGroup(this, 'AcentraTargetGroup', {
      vpc,
      port: 3001,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targetType: elbv2.TargetType.IP,
      healthCheck: { path: '/health' },
      deregistrationDelay: cdk.Duration.seconds(30),
    });
    this.acentraService.attachToApplicationTargetGroup(acentraTargetGroup);
    */

    const listener = this.alb.addListener('HttpListener', {
      port: 80,
      protocol: elbv2.ApplicationProtocol.HTTP,
      defaultAction: elbv2.ListenerAction.fixedResponse(404, { messageBody: 'Not Found' }),
    });

    // Route /auth/* to Auth Backend
    listener.addAction('AuthAction', {
      priority: 10,
      conditions: [elbv2.ListenerCondition.pathPatterns(['/auth/*', '/api/auth/*'])], // Support both just in case
      action: elbv2.ListenerAction.forward([authTargetGroup]),
    });

    /*
    // Route /api/* to Acentra Backend
    listener.addAction('AcentraAction', {
      priority: 20,
      conditions: [elbv2.ListenerCondition.pathPatterns(['/api/*'])],
      action: elbv2.ListenerAction.forward([acentraTargetGroup]),
    });
    */

    // Outputs
    new cdk.CfnOutput(this, 'AlbUrl', {
      value: `http://${this.alb.loadBalancerDnsName}`,
      description: 'Application Load Balancer URL',
      exportName: `${config.environmentName}-alb-url`,
    });
  }
}
