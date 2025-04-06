import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleResponseInterface } from './types/arcticleResponse.interface';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';
import { BackendValidationPipe } from '@app/shared/pipes/backendValidation.pipe';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  //Отримати список статей
  @Get()
  async findAll(
    @User('id') curretUserId: number,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    //@Query() - декоратор який повертає нам об'єкт з квері параметрами
    return await this.articleService.findAll(curretUserId, query);
  }

  @Get('feed')
  @UseGuards(AuthGuard)
  async getFeed(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    return await this.articleService.getFeed(currentUserId, query);
  }

  //Створити статтю
  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe()) //щоб відпрацьовувала валідація в createArticleDto
  async create(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const arcticle = await this.articleService.createArticle(
      currentUser,
      createArticleDto,
    );
    return this.articleService.buildArticleResponse(arcticle);
  }

  //Отримати конкретну статтю
  @Get(':slug') //описуэмо параметр який очікуємо в url
  async getArticle(
    @Param() params: { slug: string }, //беремо параметри з url запиту
  ): Promise<ArticleResponseInterface> {
    // console.log('slug', params.slug);
    const arcticle = await this.articleService.getArticle(params.slug);
    return this.articleService.buildArticleResponse(arcticle);
  }

  //Видалити конкретну статтю
  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(
    @User('id') currentUserId: number,
    @Param() params: { slug: string },
  ) {
    return await this.articleService.deleteArticle(currentUserId, params.slug);
  }

  //Оновити конкретну статтю
  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async updateArticle(
    @User('id') currentUserId: number, //id юзера хто хоче оновити
    @Body('article') updateArticleDto: UpdateArticleDto, //тіло запиту для оновлення
    @Param() params: { slug: string },
  ) {
    return await this.articleService.updateArticle(
      currentUserId,
      updateArticleDto,
      params.slug,
    );
  }

  //Лайкнути конкретну статтю
  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addArticleToFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.addArticleToFavorites(
      currentUserId,
      slug,
    );
    return this.articleService.buildArticleResponse(article);
  }

  //Видалити лайк з конкретної статті
  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async deleteArticleToFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.deleteArticleToFavorites(
      currentUserId,
      slug,
    );
    return this.articleService.buildArticleResponse(article);
  }
}
