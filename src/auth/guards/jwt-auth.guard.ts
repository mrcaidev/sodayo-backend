import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * JWT 路由守卫。
 *
 * 要求请求头的 authorization 字段是 Bearer 类型的 JWT token。
 *
 * 如果 token 合法，则在请求对象内添加字段 `user: { id: USER-ID }`。
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
