#!/bin/bash
BUCKET=$1
if [ -z "$BUCKET" ]; then
  echo "Usage: $0 <bucket-name>"
  exit 1
fi

echo "Removing all versions from $BUCKET..."
aws s3api list-object-versions --bucket "$BUCKET" --output json --query 'Versions[].{Key:Key,VersionId:VersionId}' | jq -r '.[] | [.Key, .VersionId] | @tsv' | \
while read -r KEY VERSION_ID; do
  if [ -n "$KEY" ]; then
    echo "Deleting $KEY version $VERSION_ID"
    aws s3api delete-object --bucket "$BUCKET" --key "$KEY" --version-id "$VERSION_ID"
  fi
done

echo "Removing all delete markers from $BUCKET..."
aws s3api list-object-versions --bucket "$BUCKET" --output json --query 'DeleteMarkers[].{Key:Key,VersionId:VersionId}' | jq -r '.[] | [.Key, .VersionId] | @tsv' | \
while read -r KEY VERSION_ID; do
  if [ -n "$KEY" ]; then
    echo "Deleting delete marker $KEY version $VERSION_ID"
    aws s3api delete-object --bucket "$BUCKET" --key "$KEY" --version-id "$VERSION_ID"
  fi
done

echo "Deleting bucket..."
aws s3 rb "s3://$BUCKET" --force
