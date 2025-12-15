#!/bin/bash
set -e

# Usage: ./deploy-auth-db.sh

echo "Deploying Authentication Backend and Database..."

# Navigate to infrastructure
cd "$(dirname "$0")/../../infrastructure"

echo "Provisioning Infrastructure (ECS Service set to 0 tasks)..."
# We use --require-approval never to avoid prompts
# This provisions VPC, RDS, ECR, ALB, and Auth Service (with 0 tasks)
npx cdk deploy DevStack --require-approval never

echo "Infrastructure provisioned."

# Navigate back to root
cd ..

echo "Building and Pushing Auth Backend Image..."
# This script handles building, pushing, and updating the service to desired count 1
./tools/scripts/build-and-push.sh dev auth-backend

echo "Deployment of Auth Backend and Database complete!"
