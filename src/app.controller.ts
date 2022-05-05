import { Controller, Get } from "@nestjs/common";
import { AppService } from "app.service";

/**
 * 根控制层。
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * 展示欢迎信息。
   */
  @Get()
  async hello() {
    return this.appService.hello();
  }
}
