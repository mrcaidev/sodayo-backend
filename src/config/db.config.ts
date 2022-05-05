import { registerAs } from "@nestjs/config";

/**
 * 数据库连接配置的数据结构。
 */
export interface DbConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

/**
 * 数据库连接配置。
 */
export const dbConfig = registerAs(
  "db",
  () =>
    ({
      host: process.env.DB_HOST || "localhost",
      port: +process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || "",
      username: process.env.DB_USER || "",
      password: process.env.DB_PASSWORD || "",
    } as DbConfig),
);
