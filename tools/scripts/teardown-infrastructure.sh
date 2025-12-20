#!/bin/bash
set -e

# Configuration
REGION="us-east-1"
ENVS=("dev" "qa" "prod")

# Navigate to infrastructure directory
cd "$(dirname "$0")/../../infrastructure"

echo "🧹 Starting comprehensive teardown for environments: ${ENVS[*]}..."

# 0. Helper function to empty S3 bucket
empty_bucket() {
  local bucket_name=$1
  if aws s3 ls "s3://$bucket_name" --region "$REGION" >/dev/null 2>&1; then
    echo "  - Found bucket: $bucket_name. Emptying..."
    aws s3 rm "s3://$bucket_name" --recursive --region "$REGION"
    echo "  - Bucket $bucket_name emptied."
  else
    echo "  - Bucket $bucket_name does not exist (skipping)."
  fi
}

# 1. Pre-Destroy Cleanup (S3 & ECR)
echo "----------------------------------------------------------------"
echo "🗑️  Performing Pre-Destroy Cleanup..."

for ENV_NAME in "${ENVS[@]}"; do
  echo ">>> Processing Environment: $ENV_NAME"
  
  # Clean S3 Buckets
  echo "    [S3] Cleaning buckets..."
  empty_bucket "acentra-storage-${ENV_NAME}"
  empty_bucket "acentra-frontend-${ENV_NAME}"

  # Clean ECR Repositories
  echo "    [ECR] Cleaning repositories..."
  ECR_REPOS=(
    "acentra-backend-${ENV_NAME}"
    "auth-backend-${ENV_NAME}"
  )
  for REPO in "${ECR_REPOS[@]}"; do
    if aws ecr describe-repositories --repository-names "$REPO" --region "$REGION" >/dev/null 2>&1; then
      echo "      - Found repository: $REPO. Deleting images..."
      IMAGES=$(aws ecr list-images --repository-name "$REPO" --region "$REGION" --query 'imageIds[*]' --output json)
      if [ "$IMAGES" != "[]" ]; then
        aws ecr batch-delete-image --repository-name "$REPO" --region "$REGION" --image-ids "$IMAGES" >/dev/null
        echo "      - All images deleted from $REPO."
      else
        echo "      - Repository is already empty."
      fi
      # Optional: Delete the repo itself if you want to be thorough, but CDK might want to delete it.
      # If CDK created it, let CDK delete it. If CDK fails because it's not empty, we solved that above.
    else
      echo "      - Repository $REPO does not exist (skipping)."
    fi
  done

  # Clean CloudWatch Log Groups
  echo "    [CloudWatch] Cleaning log groups..."
  LOG_GROUPS=(
    "/ecs/acentra-backend-${ENV_NAME}"
    "/ecs/auth-backend-${ENV_NAME}"
    "acentra-frontend-${ENV_NAME}"
  )
  for GROUP in "${LOG_GROUPS[@]}"; do
    if aws logs describe-log-groups --log-group-name-prefix "$GROUP" --region "$REGION" --query 'logGroups[0].logGroupName' --output text | grep -q "$GROUP"; then
      echo "      - Found log group: $GROUP. Deleting..."
      aws logs delete-log-group --log-group-name "$GROUP" --region "$REGION"
      echo "      - Log group $GROUP deleted."
    else
      echo "      - Log group $GROUP not found (skipping)."
    fi
  done
done

# 2. Destroy CDK Stacks
echo "----------------------------------------------------------------"
echo "💥 Destroying All CDK Stacks..."
# This will try to destroy AcentraDevStack, AcentraQaStack, AcentraProdStack
npx cdk destroy --all --force || echo "⚠️  CDK destroy encountered an error. Proceeding to cleanup..."

# 3. Post-Destroy Cleanup (Secrets)
echo "----------------------------------------------------------------"
echo "🔐 Cleaning Secrets Manager..."

for ENV_NAME in "${ENVS[@]}"; do
  SECRET="acentra-db-credentials-${ENV_NAME}"
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
