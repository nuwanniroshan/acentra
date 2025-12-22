# Technical Context & Infrastructure

## Tech Stack
### Frontend
- **Framework**: React (Vite)
- **Language**: TypeScript
- **UI**: MUI v7, Framer Motion
- **Management**: Nx Monorepo

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **ORM**: TypeORM
- **Database**: PostgreSQL

### Infrastructure
- **Provider**: AWS
- **IaC**: AWS CDK (TypeScript)
- **Containerization**: Docker
- **Compute**: ECS Fargate
- **Registry**: ECR
- **Logging**: CloudWatch

## Architecture Breakdown
1. **acentra-frontend**: React SPA served via S3/CloudFront.
2. **acentra-backend**: Core business logic (Jobs, Candidates, Feedback).
3. **auth-backend**: Authentication and Tenant validation.

## Networking
- **VPC**: Public (ALB, ECS Dev) and Private (RDS, ECS Prod) subnets.
- **ALB**: Routes `/api/*` to Backend, `/auth/*` to Auth, and Default to 404.
- **NAT**: Managed NAT (Prod) or Cost-Optimized NAT Instance.

## TODO
- Detail data migration procedures.
- Document security hardening measures.
