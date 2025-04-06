//Middleware - це те що виконується перед тим як попасти в контроллер
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ExpressRequestInterface } from '@app/types/expressRequest.interface';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';
import { UserService } from '../user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  //основна функція - парсинг токена
  constructor(private readonly userService: UserService) {}

  //клас AuthMiddleware має покрити інтерфейс NestMiddleware. Зараєстрували в app.module.ts бо ми хочето щоб вона спрацьовувала на всы види запитыв і всі роути
  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      //перевіряємо чи прийшов токен з фронтенда
      req.user = null;
      next(); //додаэмо скрізь -попадаэмо в контроллер
      return;
    }

    const token = req.headers.authorization.split(' ')[1];
    // console.log('token', token);
    try {
      const decode = verify(token, JWT_SECRET); //Розшифровуємо токен JWT !!!
      const user = await this.userService.findById(decode.id);
      req.user = user;
      // console.log('decode', decode);
      next();
    } catch (err) {
      req.user = null;
      next();
    }
  }
}
