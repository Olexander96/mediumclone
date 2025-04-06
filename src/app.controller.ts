import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() //це місце де ми реєструємо всі наші роути
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() //це декоратор з коробки nest який перехоплює всі GET запити
  getHello(): string {
    return this.appService.getHello();
  }
}
