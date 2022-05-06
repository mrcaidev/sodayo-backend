import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "app.controller";
import { AppService } from "app.service";
import { DbConfig, dbConfig } from "config/db.config";
import { jwtConfig } from "config/jwt.config";
import { UserModule } from "user/user.module";
import { OrdersModule } from "./orders/orders.module";
import { UsersModule } from "./users/users.module";

/**
 * 根模块。
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath:
        process.env.NODE_ENV === "production"
          ? ".env.production"
          : ".env.development",
      load: [dbConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get<DbConfig>("db"),
        type: "postgres",
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UserModule,
    UsersModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
