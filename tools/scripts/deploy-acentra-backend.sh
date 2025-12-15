#!/bin/bash
set -e

# Usage: ./deploy-acentra-backend.sh

echo "Deploying Acentra Backend..."

# Navigate to infrastructure
cd "$(dirname "$0")/../../infrastructure"

echo "Provisioning Infrastructure (Updating Stack)..."
# We use --require-approval never to avoid prompts
# This updates the stack to include Acentra Backend service (with 0 tasks initially)
npx cdk deploy DevStack --require-approval never

echo "Infrastructure provisioned."

# Navigate back to root
cd ..

echo "Building and Pushing Acentra Backend Image..."
# This script handles building, pushing, and updating the service to desired count 1
./tools/scripts/build-and-push.sh dev acentra-backend

echo "Deployment of Acentra Backend complete!"
