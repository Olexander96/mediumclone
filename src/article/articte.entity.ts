import { UserEntity } from '@app/user/user.entity';
import {
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'articles' })
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  body: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedDate: Date;

  @Column('simple-array')
  tagList: string[];

  @Column({ default: 0 })
  favoritesCount: number;

  @BeforeUpdate() //виконуэться перед оновленням в БД
  updateTimestamp() {
    this.updatedDate = new Date();
  }
  @ManyToOne(() => UserEntity, (user) => user.articles, { eager: true }) //робимо зязку багато до одного. Одна стання може бути написана декылькома юзерами. {eager: true} - ми завжди повертаэмо автора поста коли робимо запит
  author: UserEntity;
}
