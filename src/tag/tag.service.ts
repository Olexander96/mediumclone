import { Injectable } from '@nestjs/common';
import { TagEntity } from './tag.entity';
import { Repository } from 'typeorm'; //патерн роботи з TypeORM для роботи з таблицями
import { InjectRepository } from '@nestjs/typeorm';

@Injectable() //декоратор який дозволяє зареєструвати сервіс в нашому додатку Nest js
export class TagService {
  //сервіс це по факту клас з методами які ми можемо використовувати в контроллерах (перевикористовувати)
  constructor(
    @InjectRepository(TagEntity) //вказуємо через яку сутність (entity) ми будемо взаємодіяти
    private readonly tagRepository: Repository<TagEntity>, //tagRepository - це врапер для роботи з TagEntity сутнісню
  ) {}

  async findAll(): Promise<TagEntity[]> {
    return await this.tagRepository.find(); //find() - це метод (надаэ нам TypeORM) під капотом якого SELECT * from tags;
  }
}
