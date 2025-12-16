
export interface FileUploadConfig {
  awsRegion: string;
  s3BucketName: string;
  maxSizeBytes?: number; // Default 10MB
  allowedMimeTypes?: string[];
  accessKeyId?: string;
  secretAccessKey?: string;
}

export interface UploadInput {
  file: Buffer | Uint8Array | Blob | NodeJS.ReadableStream;
  contentType: string; // Required for S3 metadata
  contentLength?: number; // Optional but recommended
}

export interface UploadResult {
  url: string;
  key: string;
  bucket: string;
}

export interface IFileUploadService {
  upload(file: UploadInput, path: string): Promise<UploadResult>;
}
