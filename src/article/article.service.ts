import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleEntity } from './articte.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { ArticleResponseInterface } from './types/arcticleResponse.interface';
import slugify from 'slugify';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';
import { FollowEntity } from '@app/profile/follow.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    currentUserId: number,
    query: any,
  ): Promise<ArticlesResponseInterface> {
    const errorResponse = {
      errors: {},
    };

    const queryBuilder = this.dataSource
      .getRepository(ArticleEntity) //queryBuilder формує  SQL запит!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      .createQueryBuilder('articles') //articles наш аліас по якому ми звертаємося до queryBuilder
      .leftJoinAndSelect('articles.author', 'author'); //приєднуємо до таблиці поле author (воно буде не обов'язкове)

    queryBuilder.orderBy('articles.createdDate', 'DESC'); //сортуємо по параметру createdAt (DESC - спочатку нові записи)
    const articlesCount = await queryBuilder.getCount(); //повертає кількість записів з таблиці (статті)

    //1) Якщо є параметр author в запиті
    if (query.author) {
      const author = await this.userRepository.findOne({
        //знаходимо автора з таким ім'ям
        where: {
          username: query.author,
        },
      });

      if (author) {
        queryBuilder.andWhere('articles.id = :id', {
          //якщо ми знаходимо такого автора який був вказатий в квері строці то ми повертаємо тільки його статті
          id: author.id,
        });
      }
    }

    //2) Якщо є параметр tag в запиті
    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        //якщо є тег то фільтр буде повертати статті де є такий тег
        tag: `%${query.tag}%`, //так як теги це строка де вони записані через кому то ми шукаємо схожості
      });
    }

    //3) Якщо є параметр limit в запиті
    if (query.limit) {
      //limit лімік відображення статай по кількості (зчитуэмо query параметрів url запиту)
      queryBuilder.limit(query.limit);
    }

    //4) Якщо є параметр offset в запиті
    if (query.offset) {
      //offset показує з якої початок
      queryBuilder.offset(query.offset);
    }

    //5) Якщо є параметр favorited в запиті (улюблены поси конкретного юзера)
    if (query.favorited) {
      const author = await this.userRepository.findOne({
        where: {
          username: query.favorited,
        },
        relations: ['favorites'], //вказуємо залежність з іншою сутністю
      });

      if (!author) {
        errorResponse.errors['author'] = 'This Author does not exist';
        throw new HttpException(errorResponse, HttpStatus.NOT_FOUND);
      }

      const ids = author.favorites.map((item) => item.id); //чи э такі пости в масиві
      if (ids.length > 0) {
        queryBuilder.andWhere('articles.id IN (:...ids)', { ids }); //typeorm шукає в масиві постів чи є пости лайкані цим автором
      } else {
        queryBuilder.andWhere('1=0');
      }
    }

    let favoritesIds: number[] = [];

    if (currentUserId) {
      const currentUser = await this.userRepository.findOne({
        //шукаємо юзера
        where: {
          id: currentUserId,
        },
        relations: ['favorites'],
      });
      if (currentUser) {
        favoritesIds = currentUser.favorites.map((item) => item.id); //робимо масив з айдышныками лайканих статей
      }
    }

    const articles = await queryBuilder.getMany(); //повертає записи з таблиці (статті) які відповідають фільтру

    const articlesWithFaforites = articles.map((article) => {
      const favorited = favoritesIds.includes(article.id);
      return { ...article, favorited }; //якщо в юзера є айдішнік лайканої статі і він збігається з айдішніком поточної статі то ми дописуємо для неї нове поле (це поле є тільки в нас в логіці)
    });

    return { articles: articlesWithFaforites, articlesCount }; //повертаються статті згідно фільтру але з додатковим полем favorited яка ми визначаэмо тільки тут і його немажє в базі даних (воно або true або false)
  }

  async getFeed(
    currentUserId: number,
    query: any,
  ): Promise<ArticlesResponseInterface> {
    const follows = await this.followRepository.find({
      where: {
        followerId: currentUserId,
      },
    });

    if (follows.length === 0) {
      return { articles: [], articlesCount: 0 };
    }
    const followingUserIds = follows.map((item) => item.followingId); //масив айдышніків тих юзерів на кого є підписка
    const queryBuilder = this.dataSource
      .getRepository(ArticleEntity) //queryBuilder формує  SQL запит!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author') //додаэмо автора
      .where('articles.authorId IN (:...ids)', { ids: followingUserIds }); //шукаємо в масиві статей тасе ті статі у якийх айді автора є внашому масиві зафоловених юзерів

    queryBuilder.orderBy('articles.createdDate', 'DESC'); //сортування по даті

    const articlesCount = await queryBuilder.getCount();

    if (query.limit) {
      queryBuilder.limit = query.limit;
    }

    if (query.offset) {
      queryBuilder.offset = query.limit;
    }

    const filteredArticles = await queryBuilder.getMany(); //витягуємо список статей згідно фільтру

    return { articles: filteredArticles, articlesCount: articlesCount };
  }

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const newArticle = new ArticleEntity();
    Object.assign(newArticle, createArticleDto);

    if (!newArticle.tagList) {
      newArticle.tagList = [];
    }

    newArticle.author = currentUser;
    newArticle.slug = this.getSlug(createArticleDto.title); //генеруємо slug

    return await this.articleRepository.save(newArticle);
  }

  private getSlug(title: string): string {
    const currentSlug =
      slugify(title, { lower: true }) + //генеруємо наш slug за допомогою бібліотеки (slug - це параметр який перетворює строку, в нас title в строку вигляду який нам потрібен)
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36); //генеруємо рандомну приставку до нашого slug щоб зробити його унікальним

    return currentSlug;
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return { article };
  }

  findBySlug(slug: string): Promise<ArticleEntity | null> {
    return this.articleRepository.findOne({
      where: { slug },
    });
  }

  async getArticle(slug: string): Promise<ArticleEntity> {
    const errorResponse = {
      errors: {},
    };
    const article = await this.findBySlug(slug);

    if (!article) {
      errorResponse.errors['slug'] = 'Slug does not exist';
      throw new HttpException(errorResponse, HttpStatus.NOT_FOUND);
    }

    return article;
  }

  async deleteArticle(
    currentUserId: number,
    slug: string,
  ): Promise<DeleteResult> {
    const errorResponse = {
      errors: {},
    };

    //DeleteResult - тип даних з typeORM (об'єк який описує помилку)
    const article = await this.findBySlug(slug);

    if (!article) {
      errorResponse.errors['article'] = 'This Article does not exist';
      throw new HttpException(errorResponse, HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== currentUserId) {
      errorResponse.errors['author'] = 'You are not author';
      throw new HttpException(errorResponse, HttpStatus.FORBIDDEN);
    }

    return await this.articleRepository.delete({ slug });
  }

  async updateArticle(
    currentUserId: number,
    updateArticleDto: UpdateArticleDto,
    slug: string,
  ): Promise<ArticleEntity> {
    const errorResponse = {
      errors: {},
    };

    const article = await this.findBySlug(slug);

    if (!article) {
      errorResponse.errors['article'] = 'This Article does not exist';
      throw new HttpException(errorResponse, HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== currentUserId) {
      errorResponse.errors['author'] = 'You are not author';
      throw new HttpException(errorResponse, HttpStatus.FORBIDDEN);
    }

    await this.articleRepository.update(
      { id: article.author.id },
      { ...updateArticleDto },
    );

    Object.assign(article, updateArticleDto);

    // console.log(article);

    return article;
  }

  async addArticleToFavorites(
    currentUserId: number,
    slug: string,
  ): Promise<ArticleEntity> {
    const errorResponse = {
      errors: {},
    };

    const article = await this.findBySlug(slug);

    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['favorites'], //беремо юзера з відношенням
    });

    if (!article) {
      errorResponse.errors['article'] = 'Article does not exist';
      throw new HttpException(errorResponse, HttpStatus.FORBIDDEN);
    }
    if (!user) {
      errorResponse.errors['user'] = 'User does not exist';
      throw new HttpException(errorResponse, HttpStatus.FORBIDDEN);
    }

    // console.log('user', user);

    const isNotFavorited =
      user.favorites.findIndex(
        (articleInFavorites) => articleInFavorites.id === article.id,
      ) === -1; //визначаэмо чи є цей пост у лайканих постах

    if (isNotFavorited) {
      //якшо немає то додаємо в лайкані
      user.favorites.push(article);
      article.favoritesCount += 1;
      await this.userRepository.save(user); //знову зберігаємо цього користувача але вже оновленого
      await this.articleRepository.save(article); //зберыгаэмо статтю як лайкнуту
    }

    return article;
  }

  async deleteArticleToFavorites(
    currentUserId: number,
    slug: string,
  ): Promise<ArticleEntity> {
    const errorResponse = {
      errors: {},
    };

    const article = await this.findBySlug(slug);

    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['favorites'], //беремо юзера з відношенням
    });

    if (!article) {
      errorResponse.errors['article'] = 'Article does not exist';
      throw new HttpException(errorResponse, HttpStatus.FORBIDDEN);
    }
    if (!user) {
      errorResponse.errors['user'] = 'User does not exist';
      throw new HttpException(errorResponse, HttpStatus.FORBIDDEN);
    }

    const articleIndex = user.favorites.findIndex(
      (articleInFavorites) => articleInFavorites.id === article.id,
    ); //шукаємо айді статті в лайканих (favorites)

    if (articleIndex >= 0) {
      //якщо э в лайканих
      user.favorites.splice(articleIndex, 1); //видаляємо з лайканих
      article.favoritesCount -= 1;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }
}
