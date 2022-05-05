import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * 本地路由守卫。
 *
 * 要求请求体内包含用户的帐号密码。
 *
 * 如果帐号密码正确，则在请求对象内添加字段 `user: { token: JWT-TOKEN }`。
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {}
