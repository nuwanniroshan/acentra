#!/bin/bash
set -e

# Navigate to infrastructure directory
cd "$(dirname "$0")/../../infrastructure"

echo "Destroying all stacks..."
npx cdk destroy --all --force

echo "Teardown complete."
