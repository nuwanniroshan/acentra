"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3FileUploadService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
class S3FileUploadService {
    constructor(config) {
        this.config = {
            awsRegion: config?.awsRegion || process.env.AWS_REGION || "us-east-1",
            s3BucketName: config?.s3BucketName || process.env.S3_BUCKET_NAME || "acentra_storage",
            maxSizeBytes: config?.maxSizeBytes ||
                (process.env.MAX_FILE_SIZE_BYTES
                    ? parseInt(process.env.MAX_FILE_SIZE_BYTES)
                    : 10 * 1024 * 1024),
            allowedMimeTypes: config?.allowedMimeTypes ||
                (process.env.ALLOWED_MIME_TYPES
                    ? process.env.ALLOWED_MIME_TYPES.split(",")
                    : undefined),
            accessKeyId: config?.accessKeyId || process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: config?.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY,
        };
        if (!this.config.s3BucketName) {
            console.warn('S3FileUploadService: S3_BUCKET_NAME is not set. Uploads will fail.');
        }
        const s3Config = {
            region: this.config.awsRegion,
        };
        // Explicit credentials if provided (e.g. local dev), otherwise AWS SDK defaults to chain (env, role, etc)
        if (this.config.accessKeyId && this.config.secretAccessKey) {
            s3Config.credentials = {
                accessKeyId: this.config.accessKeyId,
                secretAccessKey: this.config.secretAccessKey
            };
        }
        this.s3Client = new client_s3_1.S3Client(s3Config);
    }
    async upload(input, path) {
        // Validation
        this.validateFile(input);
        try {
            const command = new client_s3_1.PutObjectCommand({
                Bucket: this.config.s3BucketName,
                Key: path,
                Body: input.file,
                ContentType: input.contentType,
                ContentLength: input.contentLength,
                ACL: input.acl, // Cast to any to avoid strict type checking issues if sdk types lag
            });
            await this.s3Client.send(command);
            // Construct URL
            const url = `https://${this.config.s3BucketName}.s3.${this.config.awsRegion}.amazonaws.com/${path}`;
            console.log(`Successfully uploaded file to ${url}`);
            return {
                url,
                key: path,
                bucket: this.config.s3BucketName
            };
        }
        catch (error) {
            console.error('S3 Upload Error details:', error);
            throw new Error(`Failed to upload file to S3: ${error.message}`);
        }
    }
    async getFileStream(path) {
        try {
            const command = new client_s3_1.GetObjectCommand({
                Bucket: this.config.s3BucketName,
                Key: path
            });
            const response = await this.s3Client.send(command);
            return response.Body;
        }
        catch (error) {
            throw new Error(`Failed to get file from S3: ${error.message}`);
        }
    }
    validateFile(input) {
        // Validate Type
        if (this.config.allowedMimeTypes && this.config.allowedMimeTypes.length > 0 && !this.config.allowedMimeTypes.includes(input.contentType)) {
            throw new Error(`File type ${input.contentType} is not allowed. Allowed types: ${this.config.allowedMimeTypes.join(', ')}`);
        }
        // Validate Size
        const maxSize = this.config.maxSizeBytes || 10 * 1024 * 1024;
        if (input.contentLength && input.contentLength > maxSize) {
            throw new Error(`File size ${input.contentLength} exceeds limit of ${maxSize} bytes`);
        }
        if (Buffer.isBuffer(input.file) && input.file.byteLength > maxSize) {
            throw new Error(`File size ${input.file.byteLength} exceeds limit of ${maxSize} bytes`);
        }
    }
}
exports.S3FileUploadService = S3FileUploadService;
//# sourceMappingURL=s3-file-upload.service.js.map