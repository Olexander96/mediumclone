import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from './tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])], //описуємо сутність яка буде задіяна в модулі
  controllers: [TagController], //контроллер для нашого модуля
  providers: [TagService], //реєструємо всі сервіси які використовуємо в модулі
}) //декоратор де описуються залежності
export class TagModule {}
