import { FileUploadConfig, IFileUploadService, UploadInput, UploadResult } from "./types";
export declare class S3FileUploadService implements IFileUploadService {
    private s3Client;
    private config;
    constructor(config?: Partial<FileUploadConfig>);
    upload(input: UploadInput, path: string): Promise<UploadResult>;
    getFileStream(path: string): Promise<any>;
    private validateFile;
}
