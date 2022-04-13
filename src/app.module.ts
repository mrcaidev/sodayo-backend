import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "app.controller";
import { configuration } from "config/configuration";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("db.host"),
        port: configService.get<number>("db.port"),
        database: configService.get<string>("db.name"),
        username: configService.get<string>("db.user"),
        password: configService.get<string>("db.password"),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
