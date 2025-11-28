import { DataSource } from "typeorm";
import { User } from "./entity/User";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

const dbConfig = {
  type: "postgres" as const,
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "auth_db",
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV !== "production",
  entities: [User],
  migrations: [],
  subscribers: [],
};

console.log("🔍 Database connection config:", {
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password ? "***" : "not set",
  database: dbConfig.database,
});

export const AppDataSource = new DataSource(dbConfig);
