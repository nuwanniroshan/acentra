#!/bin/bash
set -e

# Configuration
REGION="us-east-1"
ENV_NAME="dev"
ECR_REPOS=(
  "acentra-backend-${ENV_NAME}"
  "auth-backend-${ENV_NAME}"
)
SECRETS=(
  "acentra-db-credentials-${ENV_NAME}"
)

# Navigate to infrastructure directory
cd "$(dirname "$0")/../../infrastructure"

echo "🧹 Starting comprehensive teardown for environment: ${ENV_NAME}..."

# 1. Clean ECR Repositories
echo "----------------------------------------------------------------"
echo "🗑️  Cleaning ECR Repositories..."
for REPO in "${ECR_REPOS[@]}"; do
  echo "Checking repository: $REPO..."
  if aws ecr describe-repositories --repository-names "$REPO" --region "$REGION" >/dev/null 2>&1; then
    echo "  - Found repository: $REPO. Deleting images..."
    IMAGES=$(aws ecr list-images --repository-name "$REPO" --region "$REGION" --query 'imageIds[*]' --output json)
    if [ "$IMAGES" != "[]" ]; then
      aws ecr batch-delete-image --repository-name "$REPO" --region "$REGION" --image-ids "$IMAGES" >/dev/null
      echo "  - All images deleted from $REPO."
    else
      echo "  - Repository is already empty."
    fi
  else
    echo "  - Repository $REPO does not exist (skipping)."
  fi
done

# 2. Destroy CDK Stacks
echo "----------------------------------------------------------------"
echo "💥 Destroying CDK Stacks..."
npx cdk destroy --all --force || echo "⚠️  CDK destroy encountered an error. Proceeding to cleanup..."

# 3. Cleanup Secrets Manager (Post-destroy)
# We do this AFTER destroy to prevent dependency errors during stack deletion
echo "----------------------------------------------------------------"
echo "🔐 Cleaning Secrets Manager..."
for SECRET in "${SECRETS[@]}"; do
  echo "Checking secret: $SECRET..."
  if aws secretsmanager describe-secret --secret-id "$SECRET" --region "$REGION" >/dev/null 2>&1; then
    echo "  - Found secret: $SECRET. Force deleting..."
    aws secretsmanager delete-secret --secret-id "$SECRET" --force-delete-without-recovery --region "$REGION" >/dev/null
    echo "  - Secret $SECRET deleted."
  else
    echo "  - Secret $SECRET not found (already deleted)."
  fi
done

echo "----------------------------------------------------------------"
echo "✅ Teardown complete."
