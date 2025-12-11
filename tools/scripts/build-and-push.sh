#!/bin/bash

# Build and push Docker images to ECR for Nx Monorepo
# Usage: ./build-and-push.sh [dev|qa|prod] [service]
# Service optional: auth-backend, shortlist-backend. If omitted, builds both.

set -euo pipefail

# Ensure required commands are available
check_prereqs() {
  for cmd in aws npm docker npx; do
    if ! command -v $cmd >/dev/null 2>&1; then
      echo "❌ Error: $cmd is not installed. Please install it before proceeding."
      exit 1
    fi
  done
}

check_prereqs

ENVIRONMENT=${1:-dev}
SERVICE_FILTER=${2:-all}
AWS_REGION=${AWS_REGION:-us-east-1}
AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID:-$(aws sts get-caller-identity --query Account --output text)}
GIT_HASH=$(git rev-parse --short HEAD)

echo "🚀 Starting build and push for environment: $ENVIRONMENT"
echo "📍 Region: $AWS_REGION"
echo "🆔 Account: $AWS_ACCOUNT_ID"
echo "Commit: $GIT_HASH"

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|qa|prod)$ ]]; then
  echo "❌ Error: Environment must be dev, qa, or prod"
  exit 1
fi

# Define services
SERVICES=("auth-backend" "acentra-backend")

# Login to ECR
echo "🔐 Logging in to ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Move to root directory
cd "$(dirname "$0")/../.."

for SERVICE in "${SERVICES[@]}"; do
  if [[ "$SERVICE_FILTER" != "all" && "$SERVICE_FILTER" != "$SERVICE" ]]; then
    continue
  fi

  echo "----------------------------------------------------------------"
  echo "📦 Processing service: $SERVICE"
  echo "----------------------------------------------------------------"

  ECR_REPO="$SERVICE-$ENVIRONMENT"
  ECR_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO"

  # Ensure ECR repository exists
  if ! aws ecr describe-repositories --repository-names "$ECR_REPO" --region "$AWS_REGION" >/dev/null 2>&1; then
    echo "🆕 Creating ECR repository $ECR_REPO..."
    aws ecr create-repository --repository-name "$ECR_REPO" --region "$AWS_REGION"
  fi

  # Build application using Nx
  echo "🔨 Building $SERVICE with Nx..."
  npx nx build $SERVICE --configuration=production

  # Build Docker image
  echo "🐳 Building Docker image for $SERVICE..."
  # Use the optimized Dockerfile in apps/$SERVICE/Dockerfile which uses dist/ output
  docker build --platform linux/amd64 -t $ECR_REPO:latest -t $ECR_REPO:$GIT_HASH -f apps/$SERVICE/Dockerfile .

  # Tag image for ECR
  docker tag $ECR_REPO:latest $ECR_URI:latest
  docker tag $ECR_REPO:$GIT_HASH $ECR_URI:$GIT_HASH

  # Push to ECR
  echo "⬆️  Pushing to ECR..."
  docker push $ECR_URI:latest
  docker push $ECR_URI:$GIT_HASH

  # Update ECS Service
  ECS_CLUSTER="acentra-$ENVIRONMENT-cluster"
  ECS_SERVICE="$SERVICE-$ENVIRONMENT-service"

  echo "🔄 Updating ECS service $ECS_SERVICE in cluster $ECS_CLUSTER..."
  # Check if service exists first to avoid error on first deploy
  if aws ecs describe-services --cluster $ECS_CLUSTER --services $ECS_SERVICE --region $AWS_REGION | grep -q "MISSING"; then
      echo "⚠️  Service $ECS_SERVICE not found. Skipping update (it might be created by CDK later)."
  else
      aws ecs update-service \
        --cluster $ECS_CLUSTER \
        --service $ECS_SERVICE \
        --force-new-deployment \
        --region $AWS_REGION > /dev/null
      echo "✅ ECS service update triggered."
  fi
done

echo "----------------------------------------------------------------"
echo "🎉 Build and push completed successfully!"
