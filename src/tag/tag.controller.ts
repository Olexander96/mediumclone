import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  //   @Get() //роут акий буде відпрацьовувати по GET запиту на роут .../tags
  //   findAll() {
  //     return ['dragons', 'coffee'];
  //   }
  constructor(private readonly tagService: TagService) {}
  @Get()
  async findAll(): Promise<{ tags: string[] }> {
    //{ tags: string[] } - описуємо те що в має буди в return
    const tags = await this.tagService.findAll(); //те саме що і вище  тільки використовуємо метод сервіса для цього
    return {
      tags: tags.map((tag) => tag.name), //масив тегів
    };
  }
}
