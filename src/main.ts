if (!process.env.IS_TS_NODE) {
  //якщо додаток запушений не в режимі розробки (пишемо це в package.json -> scripts.start, він це робить)
  require('module-alias/register'); //module-alias - модуль, який дозволяєробити аліеси для шляхів (_moduleAliases описаний в package.json)
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
