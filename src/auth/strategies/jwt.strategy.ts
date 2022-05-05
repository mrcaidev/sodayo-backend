import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { JwtConfig } from "config/jwt.config";
import { ExtractJwt, Strategy } from "passport-jwt";

/**
 * JWT token 解析结果的数据结构。
 */
interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

/**
 * JWT 验证策略。
 *
 * 使用 secret 解密 token 获得用户 ID。
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<JwtConfig>("jwt.secret"),
    });
  }

  async validate(payload: JwtPayload) {
    return { id: payload.id };
  }
}
