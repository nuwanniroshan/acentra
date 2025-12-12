#!/bin/bash

# Manual deployment script for CDK infrastructure
# Usage: ./deploy.sh [dev|qa|prod]

set -euo pipefail

# Function to check required commands
check_prereqs() {
  for cmd in aws npm npx; do
    if ! command -v $cmd >/dev/null 2>&1; then
      echo "❌ Error: $cmd is not installed. Please install it before proceeding."
      exit 1
    fi
  done
}

check_prereqs

ENVIRONMENT=${1:-dev}

echo "🚀 Deploying to $ENVIRONMENT environment..."

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|qa|prod)$ ]]; then
  echo "❌ Error: Environment must be dev, qa, or prod"
  exit 1
fi

# Change to infrastructure directory
cd "$(dirname "$0")/../../infrastructure"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing CDK dependencies..."
  npm install
fi

# Build TypeScript
echo "🔨 Building CDK project..."
npm run build

# Determine stack name
case $ENVIRONMENT in
  dev)
    STACK_NAME="DevStack"
    ;;
  qa)
    STACK_NAME="QaStack"
    ;;
  prod)
    STACK_NAME="ProdStack"
    ;;
esac

# Synthesize CloudFormation template
echo "🔍 Synthesizing CloudFormation template..."
npx cdk synth $STACK_NAME

# Deploy stack
echo "☁️  Deploying $STACK_NAME..."
npx cdk deploy $STACK_NAME --require-approval never

echo "✅ Deployment complete!"
echo ""

# Get Stack Name (CloudFormation Stack Name)
ENV_CAPITALIZED=$(echo $ENVIRONMENT | awk '{print toupper(substr($0,1,1))substr($0,2)}')
CFN_STACK_NAME="Acentra${ENV_CAPITALIZED}Stack"
AWS_REGION=${AWS_REGION:-us-east-1}

echo "🔍 Fetching service URLs..."
ALB_URL=$(aws cloudformation describe-stacks \
  --stack-name $CFN_STACK_NAME \
  --query "Stacks[0].Outputs[?contains(OutputKey,'AlbUrl')].OutputValue" \
  --output text \
  --region $AWS_REGION)

FRONTEND_URL=$(aws cloudformation describe-stacks \
  --stack-name $CFN_STACK_NAME \
  --query "Stacks[0].Outputs[?contains(OutputKey,'Url')].OutputValue" \
  --output text \
  --region $AWS_REGION | head -n 1)

echo "----------------------------------------------------------------"
if [ -n "$FRONTEND_URL" ] && [ "$FRONTEND_URL" != "None" ]; then
  echo "🌐 Frontend URL: $FRONTEND_URL"
fi
if [ -n "$ALB_URL" ] && [ "$ALB_URL" != "None" ]; then
  echo "🔌 Backend ALB URL: $ALB_URL"
fi
echo "----------------------------------------------------------------"
echo ""
echo "📝 Next steps:"
echo "1. Build and push Docker image: ./tools/scripts/build-and-push.sh $ENVIRONMENT"
echo "2. Deploy frontend: ./tools/scripts/deploy-frontend.sh $ENVIRONMENT"
