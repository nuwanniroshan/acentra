"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const tslib_1 = require("tslib");
const winston_1 = tslib_1.__importDefault(require("winston"));
const winston_cloudwatch_1 = tslib_1.__importDefault(require("winston-cloudwatch"));
const isProduction = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging";
// Base transports (Console is always active)
const transports = [
    new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
    }),
];
// Add CloudWatch transport in production/staging if credentials exist
if (isProduction) {
    if (process.env.AWS_REGION && process.env.CLOUDWATCH_LOG_GROUP) {
        try {
            const cloudWatchTransport = new winston_cloudwatch_1.default({
                logGroupName: process.env.CLOUDWATCH_LOG_GROUP,
                logStreamName: process.env.CLOUDWATCH_LOG_STREAM || `instance-${process.env.HOSTNAME || 'unknown'}-${Date.now()}`,
                awsRegion: process.env.AWS_REGION,
                jsonMessage: true,
                // Assuming AWS credentials are picked up from environment or IAM role
            });
            transports.push(cloudWatchTransport);
            console.log("CloudWatch logging enabled");
        }
        catch (error) {
            console.error("Failed to initialize CloudWatch transport:", error);
        }
    }
    else {
        console.warn("CloudWatch/AWS config missing, skipping CloudWatch logging");
    }
}
exports.logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: winston_1.default.format.json(),
    transports: transports,
});
//# sourceMappingURL=index.js.map