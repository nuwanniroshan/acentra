import "reflect-metadata";
import { DataSource } from "typeorm";
import { logger } from "@acentra/logger";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { User } from "../entity/User";
import { Job } from "../entity/Job";
import { Candidate } from "../entity/Candidate";
import { Comment } from "../entity/Comment";
import { Office } from "../entity/Office";
import { Department } from "../entity/Department";
import { PipelineStatus } from "../entity/PipelineStatus";
import { PipelineHistory } from "../entity/PipelineHistory";

dotenv.config();

async function exportData() {
  logger.info("🚀 Starting data export...");

  const dataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "shortlist",
    entities: [User, Job, Candidate, Comment, Office, Department, PipelineStatus, PipelineHistory],
    synchronize: false,
    logging: false,
  });

  try {
    await dataSource.initialize();
    logger.info("✅ Connected to Local DB");

    const data: any = {};

  // Helper to fetch entity
    const fetchEntity = async (entity: any, name: string) => {
      logger.info(`📦 Fetching ${name}...`);
      const repo = dataSource.getRepository(entity);
      const records = await repo.find();
      data[name] = records;
      logger.info(`   Found ${records.length} records`);
    };

    await fetchEntity(Office, "Office");
    await fetchEntity(Department, "Department");
    await fetchEntity(User, "User");
    await fetchEntity(PipelineStatus, "PipelineStatus");
    await fetchEntity(Job, "Job");
    await fetchEntity(Candidate, "Candidate");
    await fetchEntity(Comment, "Comment");
    await fetchEntity(PipelineHistory, "PipelineHistory");

  // Ensure directory exists
    const outputDir = path.join(__dirname, "../scripts");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, "data-export.json");
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    logger.info(`✅ Data exported to ${outputPath}`);
    
  } catch (error) {
    logger.error("❌ Export failed:", error);
  } finally {
    if (dataSource.isInitialized) await dataSource.destroy();
  }
}

exportData();
