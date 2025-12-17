import winston from "winston";
import WinstonCloudWatch from "winston-cloudwatch";

const isProduction = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging";

// Base transports (Console is always active)
const transports: winston.transport[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
];

// Add CloudWatch transport in production/staging if credentials exist
if (isProduction) {
  if (process.env.AWS_REGION && process.env.CLOUDWATCH_LOG_GROUP) {
      try {
        const cloudWatchTransport = new WinstonCloudWatch({
            logGroupName: process.env.CLOUDWATCH_LOG_GROUP,
            logStreamName: process.env.CLOUDWATCH_LOG_STREAM || `instance-${process.env.HOSTNAME || 'unknown'}-${Date.now()}`,
            awsRegion: process.env.AWS_REGION,
            jsonMessage: true,
            // Assuming AWS credentials are picked up from environment or IAM role
        });
        transports.push(cloudWatchTransport);
        console.log("CloudWatch logging enabled");
      } catch (error) {
          console.error("Failed to initialize CloudWatch transport:", error);
      }
  } else {
      console.warn("CloudWatch/AWS config missing, skipping CloudWatch logging");
  }
}

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.json(),
  transports: transports,
});
