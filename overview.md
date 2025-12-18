# Acentra Project Architecture Guide

## 1. Overview
Acentra is a modern Applicant Tracking System (ATS) designed to streamline the recruitment process. It supports multi-tenancy, allowing different organizations (tenants) to manage their hiring pipelines, jobs, candidates, and user roles independently within a single hosted instance. The system provides a seamless experience for recruiters and administrators to create jobs, track applicants, collect feedback, and manage the hiring workflow.

## 2. High-Level Features
*   **Multi-Tenancy**: Complete tracking data isolation per tenant with tenant-specific URLs (e.g., `/:tenantId/dashboard`).
*   **Job Management**: Create, edit, and track job openings with detailed descriptions, departments, and tagging.
*   **Candidate Tracking**: Upload CVs, track candidate progress through different pipeline stages (Applied, Screening, Interview, Offer, etc.).
*   **Recruitment Pipeline**: Customizable workflow for moving candidates through hiring stages (`Job` -> `Candidate` -> `Pipeline`).
*   **Feedback System**: Collect and manage feedback on candidates from interviewers using customizable templates.
*   **User Management**: Role-based access control (Admin, Recruiter, etc.) managed via a dedicated Authentication service.
*   **Dashboard**: Analytics and overview of open jobs and recent candidate activities.
*   **Secure Authentication**: JWT-based authentication with tenant context.

## 3. Technologies and Tech Stack

### Frontend
*   **Framework**: React (built with Vite)
*   **Language**: TypeScript
*   **UI Library**: Material UI (MUI) v7, Framer Motion for animations.
*   **State Management**: React Context (Theme, Notifications, Auth).
*   **Routing**: React Router v6.
*   **Build Tool**: Nx (Monorepo management).

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express (via custom wrapper/setup within Nx apps).
*   **Language**: TypeScript
*   **ORM**: TypeORM
*   **Database**: PostgreSQL
*   **Authentication**: Custom JWT implementation with `bcryptjs`.

### Infrastructure & DevOps
*   **IaC**: AWS CDK (Cloud Development Kit) using TypeScript.
*   **CI/CD**: GitHub Actions.
*   **Containerization**: Docker.
*   **Cloud Provider**: AWS.

## 4. Architecture Overview

The system follows a microservices-inspired architecture, split primarily into frontend, backend API, and authentication service.

### Component Breakdown
1.  **Acentra Frontend (`acentra-frontend`)**: A Single Page Application (SPA) served via S3 (and CloudFront in Prod). It consumes the APIs.
2.  **Acentra Backend (`acentra-backend`)**: The core business logic service. Handles Jobs, Candidates, Feedback, and specific tenant data.
3.  **Auth Backend (`auth-backend`)**: Dedicated service for User authentication and Tenant validation.

### Network Components
*   **VPC (Virtual Private Cloud)**: Isolates the network environment.
    *   **Public Subnets**: Host the Application Load Balancer (ALB) and, in Dev/Cost-optimized modes, the ECS Tasks to avoid NAT costs.
    *   **Private Subnets**: Host the RDS Database (and ECS tasks in Prod).
*   **Application Load Balancer (ALB)**: A single ALB routes traffic based on path:
    *   `/api/*` -> Acentra Backend
    *   `/auth/*` -> Auth Backend
    *   Default -> 404 (Frontend interacts via these API routes).
*   **NAT Gateways**: Used in Production (Private Subnets) to allow outbound internet access for private resources.

### AWS Components
*   **Compute**: AWS ECS (Elastic Container Service) with **Fargate** launch type for serverless container management.
*   **Database**: Amazon RDS for PostgreSQL.
*   **Storage**: Amazon S3 (Job Descriptions, CVs, Frontend Assets).
*   **Registry**: Amazon ECR (Elastic Container Registry) for storing Docker images.
*   **secrets Management**: AWS Secrets Manager (implied for DB credentials).
*   **Logging**: Amazon CloudWatch (via Winston transport in apps).

## 5. Entity Relationship (Simplified)

The following diagram outlines the core data entities and their relationships.

*   **Tenant**
    *   Has many **Users**
    *   Has many **Jobs**
    *   Has many **Candidates** (via Jobs)
*   **User**
    *   Belongs to a **Tenant**
    *   Creates/Manages **Jobs**
*   **Job**
    *   Belongs to a **Tenant**
    *   Created by a **User**
    *   Has many **Candidates**
    *   Has many **FeedbackTemplates**
*   **Candidate**
    *   Applies to a **Job**
    *   Has **PipelineStatus**
    *   Has many **Feedbacks** (implied)

## 6. CI/CD

The project utilizes **GitHub Actions** for Continuous Integration and Deployment.
*   **Workflow**: `.github/workflows/deploy-dev.yml`
*   **Triggers**: `workflow_dispatch` (Manual trigger).
*   **Steps**:
    1.  **Checkout & Setup**: Clones repo, sets up Node.js.
    2.  **Install Dependencies**: Installs root and infrastructure dependencies.
    3.  **Configure AWS**: Uses OIDC (OpenID Connect) for secure AWS authentication (no long-lived access keys).
    4.  **Deploy Infrastructure**: Runs `cdk deploy` to provision/update AWS resources.
    5.  **Build & Push Images**: Builds Docker images for backend services and pushes them to ECR.
    6.  **Update Services**: Forces ECS service updates to pull new images.
    7.  **Deploy Frontend**: Builds React app and syncs static assets to the S3 bucket.

## 7. Deployment Guide

### Local Deployment
1.  **Prerequisites**: Node.js v20+, Docker, PostgreSQL (local).
2.  **Install Dependencies**: `npm install`
3.  **Database Setup**: Ensure local Postgres is running and connection details in `.env` or `data-source.ts` are correct.
4.  **Run Development Servers**:
    ```bash
    npm start
    # Or start individual apps:
    # nx serve acentra-frontend
    # nx serve acentra-backend
    ```

### Remote Deployment (AWS Dev)
1.  **Credentials**: Ensure `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are set in GitHub Secrets.
2.  **Trigger**: Go to GitHub Actions -> Select "Deploy Dev" -> Run Workflow.
3.  **Manual Script**:
    You can also run the deployment scripts from the `tools/scripts` directory if you have AWS credentials configured locally:
    ```bash
    ./tools/scripts/deploy-acentra-backend.sh
    ./tools/scripts/deploy-frontend.sh dev
    ```

## 8. AWS Estimated Cost (Monthly Scenarios)

### Scenario 1: Minimal / MVP (Development or Stealth Mode)
**Architecture**: Single Availability Zone (AZ), Public Subnets for Compute (No NAT Gateway), Standard Security.
**Target Audience**: Early-stage startups, Proof of Concept, or Development environments.

| Service | Configuration | Monthly Cost (Est.) |
| :--- | :--- | :--- |
| **Compute (ECS Fargate)** | 2 Services (Auth, Backend)<br>1 Task each (0.25 vCPU, 0.5 GB RAM)<br>Running 24/7 | ~$18.00 |
| **Database (RDS)** | PostgreSQL `db.t3.micro`<br>Single AZ, 20GB Storage | ~$15.00 |
| **Load Balancer (ALB)** | 1 Application Load Balancer (Shared)<br>Minimal Traffic | ~$18.00 |
| **Networking** | No NAT Gateways (Public Subnets)<br>Data Transfer (< 10GB) | < $1.00 |
| **Operations** | CloudWatch Logs (Low retention), Secrets Manager | ~$3.00 |
| **Total Scenario 1** | | **~$55.00 / month** |

### Scenario 2: Growing / Production Ready (Idle/Low Traffic)
**Architecture**: Multi-AZ (High Availability), Private Subnets for Compute (Requires NAT Gateways), Production-grade Security.
**Target Audience**: Live Production apps preparing for scale, requiring 99.9% uptime and security compliance.

| Service | Configuration | Monthly Cost (Est.) |
| :--- | :--- | :--- |
| **Compute (ECS Fargate)** | 2 Services (Auth, Backend)<br>2 Tasks each (High Availability)<br>0.25 vCPU, 0.5 GB RAM per task | ~$36.00 |
| **Database (RDS)** | PostgreSQL `db.t3.small` (Performance baseline)<br>**Multi-AZ** (Redundancy), 50GB Storage | ~$78.00 |
| **Networking (NAT)** | **2 NAT Gateways** (1 per AZ for Private Subnets)<br>Required for secure outbound traffic | ~$75.00 |
| **Load Balancer (ALB)** | 1 Application Load Balancer<br>Cross-zone load balancing enabled | ~$20.00 |
| **Storage & Ops** | S3, CloudWatch, Secrets Manager, Backups | ~$11.00 |
| **Total Scenario 2** | | **~$220.00 / month** |

*Key Takeaway: moving from MVP to a Production-Ready architecture introduces fixed infrastructure costs (NAT Gateways, Multi-AZ DB) typically adding ~$150/month regardless of traffic volume.*

## 9. Conclusion
Acentra is built on a robust, scalable tech stack leveraging modern web frameworks and cloud-native infrastructure. Its architecture is designed to support multi-tenancy securely while maintaining ease of deployment through IaC and automated pipelines. The use of AWS managed services (ECS Fargate, RDS) ensures low operational overhead, allowing the team to focus on feature development.
