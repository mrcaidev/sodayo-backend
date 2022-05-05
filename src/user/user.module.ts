import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "auth/strategies/jwt.strategy";
import { LocalStrategy } from "auth/strategies/local.strategy";
import { UsersModule } from "users/users.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

/**
 * 当前用户模块。
 */
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("jwt.secret"),
        signOptions: { expiresIn: "1d" },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService, LocalStrategy, JwtStrategy],
})
export class UserModule {}
