import { registerAs } from "@nestjs/config";

/**
 * JWT 配置的数据结构。
 */
export interface JwtConfig {
  secret: string;
}

/**
 * JWT 配置。
 */
export const jwtConfig = registerAs(
  "jwt",
  () =>
    ({
      secret: process.env.JWT_SECRET || "",
    } as JwtConfig),
);
