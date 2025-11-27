import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface EcrConstructProps {
  environmentName: string;
}

export class EcrConstruct extends Construct {
  public readonly shortlistBackendRepository: ecr.Repository;
  public readonly authBackendRepository: ecr.Repository;

  constructor(scope: Construct, id: string, props: EcrConstructProps) {
    super(scope, id);

    const { environmentName } = props;

    // Create ECR repository for shortlist-backend
    this.shortlistBackendRepository = new ecr.Repository(this, 'ShortlistBackendRepository', {
      repositoryName: `shortlist-backend-${environmentName}`,
      imageScanOnPush: true,
      imageTagMutability: ecr.TagMutability.MUTABLE,
      removalPolicy: environmentName === 'prod' 
        ? cdk.RemovalPolicy.RETAIN 
        : cdk.RemovalPolicy.DESTROY,
      emptyOnDelete: environmentName !== 'prod',
      lifecycleRules: [
        {
          description: 'Keep only last 10 images',
          maxImageCount: 10,
        },
      ],
    });

    // Create ECR repository for auth-backend
    this.authBackendRepository = new ecr.Repository(this, 'AuthBackendRepository', {
      repositoryName: `auth-backend-${environmentName}`,
      imageScanOnPush: true,
      imageTagMutability: ecr.TagMutability.MUTABLE,
      removalPolicy: environmentName === 'prod' 
        ? cdk.RemovalPolicy.RETAIN 
        : cdk.RemovalPolicy.DESTROY,
      emptyOnDelete: environmentName !== 'prod',
      lifecycleRules: [
        {
          description: 'Keep only last 10 images',
          maxImageCount: 10,
        },
      ],
    });

    // Output the repository URIs
    new cdk.CfnOutput(this, 'ShortlistBackendRepositoryUri', {
      value: this.shortlistBackendRepository.repositoryUri,
      description: 'Shortlist Backend ECR Repository URI',
      exportName: `${environmentName}-shortlist-backend-ecr-uri`,
    });

    new cdk.CfnOutput(this, 'AuthBackendRepositoryUri', {
      value: this.authBackendRepository.repositoryUri,
      description: 'Auth Backend ECR Repository URI',
      exportName: `${environmentName}-auth-backend-ecr-uri`,
    });
  }
}
