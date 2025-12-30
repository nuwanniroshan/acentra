import "reflect-metadata";
import { AppDataSource } from "@/data-source";
import { logger } from "@acentra/logger";
import * as fs from "fs";
import * as path from "path";

async function clearData() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    logger.info("✅ Database connection initialized");

    // Get repositories


    // Use raw SQL to truncate tables with CASCADE to handle foreign keys
    logger.info("🗑️  Clearing all data from database...");
    
    await AppDataSource.query('TRUNCATE TABLE "comment" CASCADE');
    logger.info("   ✅ Comments cleared");
    
    await AppDataSource.query('TRUNCATE TABLE "candidate" CASCADE');
    logger.info("   ✅ Candidates cleared");
    
    await AppDataSource.query('TRUNCATE TABLE "job" CASCADE');
    logger.info("   ✅ Jobs cleared");

    // Clear uploads directory
    const uploadsDir = path.join(__dirname, "../../uploads");
    logger.info("🗑️  Clearing uploads directory...");
    
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      let filesDeleted = 0;
      
      for (const file of files) {
        // Skip .gitkeep if it exists
        if (file === ".gitkeep") continue;
        
        const filePath = path.join(uploadsDir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isFile()) {
          fs.unlinkSync(filePath);
          filesDeleted++;
        } else if (stat.isDirectory()) {
          // Recursively delete directory
          fs.rmSync(filePath, { recursive: true, force: true });
          filesDeleted++;
        }
      }
      
      logger.info(`   Deleted ${filesDeleted} files/folders from uploads`);
    } else {
      logger.info("   Uploads directory does not exist");
    }

    logger.info("\n✅ All data cleared successfully!");
    
    // Close database connection
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    logger.error("❌ Error clearing data:", error);
    process.exit(1);
  }
}

clearData();
