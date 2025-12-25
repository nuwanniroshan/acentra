# Project Vision

## Overview
Acentra is a modern Applicant Tracking System (ATS) designed to streamline the recruitment process. It supports multi-tenancy, allowing different organizations (tenants) to manage their hiring pipelines, jobs, candidates, and user roles independently within a single hosted instance.

## High-Level Features
*   **Multi-Tenancy**: Complete tracking data isolation per tenant with tenant-specific URLs.
*   **Job Management**: Create, edit, and track job openings with detailed descriptions, departments, and tagging.
*   **Candidate Tracking**: Upload CVs, track candidate progress through different pipeline stages (Applied, Screening, Interview, Offer, etc.).
*   **Recruitment Pipeline**: Customizable workflow for moving candidates through hiring stages (`Job` -> `Candidate` -> `Pipeline`).
*   **Feedback System**: Collect and manage feedback on candidates from interviewers using customizable templates.
*   **User Management**: Role-based access control (Admin, Recruiter, etc.) managed via a dedicated Authentication service.
*   **Dashboard**: Analytics and overview of open jobs and recent candidate activities.
*   **Secure Authentication**: JWT-based authentication with tenant context.

## Goals
- Provide a seamless experience for recruiters and administrators to manage the hiring workflow.
- Ensure secure and isolated multi-tenant environments.
- Optimize operational costs using modern cloud architecture (Graviton, Fargate Spot, etc.).

## TODO
- Define long-term product roadmap.
- Identify key market differentiators.
