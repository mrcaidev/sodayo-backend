import { Injectable } from "@nestjs/common";

/**
 * 根服务层。
 */
@Injectable()
export class AppService {
  /**
   * 展示欢迎信息。
   */
  async hello() {
    return `速达优跑腿服务-${new Date().getFullYear()}`;
  }
}
