
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EnvironmentConfig } from '../config/environment-config';

export interface S3StorageConstructProps {
  config: EnvironmentConfig;
}

export class S3StorageConstruct extends Construct {
  public readonly bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: S3StorageConstructProps) {
    super(scope, id);

    const { config } = props;

    // Create S3 bucket for file storage
    this.bucket = new s3.Bucket(this, 'StorageBucket', {
      bucketName: `acentra-storage-${config.environmentName}`,
      // Security: Block public access by default. 
      // We will rely on Pre-signed URLs or publicReadAccess if explicitly needed via Object ACLs, 
      // but best practice is BlockPublicAccess.BLOCK_ALL and use cloudfront or signed urls.
      // However, "Simple S3 File Upload" and "Return the public or signed S3 URL".
      // If we want public URLs, we need public read.
      // If we want signed URLs, we can use private.
      // Given "Simple", and "profile pictures", public read is often used.
      // But let's try to be secure: BLOCK_ALL if possible.
      // But then we MUST generate signed URLs for every GET.
      // If the user wants "Return the public ... URL", maybe they want public access.
      // Let's allow public ACLs but block public policy, so we can set ACL per object if needed?
      // Or just standard private for now and assume the Service generates Signed URLs?
      // The Service I wrote generates a generic https url. This implies PUBLIC access is expected for that URL to work without query params.
      // If I want to support public access for profile pics:
      publicReadAccess: true, // Make contents publicly readable via Bucket Policy
      blockPublicAccess: new s3.BlockPublicAccess({
          blockPublicAcls: true, // Block ACLs as we use Bucket Policy
          blockPublicPolicy: false, // Allow Public Policy
          ignorePublicAcls: true, // Ignore ACLs
          restrictPublicBuckets: false
      }),
      removalPolicy: config.environmentName === 'prod'
        ? cdk.RemovalPolicy.RETAIN
        : cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: config.environmentName !== 'prod',
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
            s3.HttpMethods.HEAD,
          ],
          allowedOrigins: ['*'], // Tune this for security in prod if needed, but for "Simple" and dev this is okay.
          allowedHeaders: ['*'],
        },
      ],
    });

    // Output bucket name
    new cdk.CfnOutput(this, 'StorageBucketName', {
      value: this.bucket.bucketName,
      description: 'Storage S3 Bucket Name',
      exportName: `${config.environmentName}-storage-bucket`,
    });
  }
}
