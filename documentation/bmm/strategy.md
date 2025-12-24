# Project Strategy

## Technical Strategy
The project follows a microservices-inspired architecture, split into frontend, backend API, and authentication service. It leverages AWS native services for scalability and cost-efficiency.

## Infrastructure Strategy
- **Compute**: AWS ECS with Fargate (Graviton + Spot) for serverless container management.
- **Database**: Multi-tenant PostgreSQL on Amazon RDS.
- **Networking**: Path-based routing via ALB, VPC isolation, and cost-optimized NAT instances for production.
- **CI/CD**: Automated deployment via GitHub Actions and AWS CDK.

## Cost Optimization Strategy
Implementation of high optimization:
- Use of AWS Graviton (ARM64) processors.
- Leveraging Fargate Spot instances.
- Replacing managed NAT Gateways with self-managed NAT instances.
- S3 Intelligent-Tiering for storage.

## TODO
- Define go-to-market strategy.
- Detail partnership and integration strategies.
