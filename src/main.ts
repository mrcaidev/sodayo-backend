import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { HttpExceptionFilter } from "common/filters/http-exception.filter";
import { AppModule } from "./app.module";

/**
 * 服务端启动引导方法。
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 允许所有域名访问。
  app.enableCors({ origin: "*" });

  // 自定义 HTTP 异常处理层。
  app.useGlobalFilters(new HttpExceptionFilter());

  // 对客户端数据启用白名单过滤与类型转换。
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
    }),
  );

  // 开始监听端口。
  await app.listen(3600);
}

bootstrap();
