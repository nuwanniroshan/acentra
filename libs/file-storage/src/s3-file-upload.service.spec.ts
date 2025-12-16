
import { S3FileUploadService } from './s3-file-upload.service';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';

const s3Mock = mockClient(S3Client);

describe('S3FileUploadService', () => {
  let service: S3FileUploadService;

  beforeEach(() => {
    s3Mock.reset();
    service = new S3FileUploadService({
      awsRegion: 'us-east-1',
      s3BucketName: 'test-bucket',
    });
  });

  it('should upload a file successfully', async () => {
    s3Mock.on(PutObjectCommand).resolves({});

    const result = await service.upload({
      file: Buffer.from('test'),
      contentType: 'text/plain',
      contentLength: 4
    }, 'test.txt');

    expect(result.url).toBe('https://test-bucket.s3.us-east-1.amazonaws.com/test.txt');
    expect(result.key).toBe('test.txt');
  });

  it('should validate file size', async () => {
      service = new S3FileUploadService({ maxSizeBytes: 2, awsRegion: 'us-east-1', s3BucketName: 'test' });
      
      await expect(service.upload({
          file: Buffer.from('test'), // 4 bytes
          contentType: 'text/plain'
      }, 'test.txt')).rejects.toThrow(/exceeds limit/);
  });

  it('should validate mime type', async () => {
      service = new S3FileUploadService({ allowedMimeTypes: ['image/png'], awsRegion: 'us-east-1', s3BucketName: 'test' });
      
      await expect(service.upload({
          file: Buffer.from('test'),
          contentType: 'text/plain'
      }, 'test.txt')).rejects.toThrow(/not allowed/);
  });
});
