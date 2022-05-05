import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";

/**
 * 自定义 HTTP 异常处理层。
 *
 * 异常响应模型：
 * ```json
 * {
 *   "error": "Error message"
 * }
 * ```
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // 捕获异常的状态码和数据体。
    const status = exception.getStatus();
    const res = exception.getResponse();

    // 获取响应对象。
    const response = host.switchToHttp().getResponse<Response>();

    // 自定义错误信息。
    const error =
      typeof res === "string"
        ? res
        : typeof res["message"] === "string"
        ? res["message"]
        : typeof res["message"] === "object"
        ? res["message"][0]
        : res["message"];

    // 发送响应。
    response.status(status).json({ error });
  }
}
