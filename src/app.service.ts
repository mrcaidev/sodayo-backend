import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  async hello() {
    return `速达优跑腿服务-${new Date().getFullYear()}`;
  }
}
