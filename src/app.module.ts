import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { TagModule } from '@app/tag/tag.module';

import { TypeOrmModule } from '@nestjs/typeorm'; //імпордуємо модуть TypeORM
import ormconfig from './ormconfig'; //імпортуємо наші налаштування ormconfig TypeORM
import UserModule from './user/user.module';
import { AuthMiddleware } from './user/middlewares/auth.middleware';
import { ArticleModule } from './article/artitle.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    TagModule,
    UserModule,
    ArticleModule,
    ProfileModule,
  ], //це основний модуль і тут реєструємо дочірні модулі
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    //зараєстрували наш Middleware
    consumer.apply(AuthMiddleware).forRoutes({
      //AuthMiddleware основна функція - парсинг токена
      path: '*', //всі роути
      method: RequestMethod.ALL, //всі методи
    });
  }
}
