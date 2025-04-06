import { ArticleEntity } from '@app/article/articte.entity';
import { hash } from 'bcrypt'; //функцыя для хешування з бібліотери bcrypto
import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ default: '' }) //по дефолту пусте
  bio: string;

  @Column({ default: '' })
  image: string;

  @Column()
  email: string;

  @Column({ select: false }) //робимо так щоб пароль не відображався у відповіді клієнту
  password: string;

  @BeforeInsert() //декоратор який дає змогу виконати щось перед записов в базу даних
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  @OneToMany(() => ArticleEntity, (articte) => articte.author) //відношення один до багатьох. Тобто цю статтю можуть створити декілька юзерів і це буде масив статей
  articles: ArticleEntity[];

  @ManyToMany(() => ArticleEntity)
  @JoinTable()
  favorites: ArticleEntity[]; //тобто один юзер може лайкати декілька статей (масив статей)
}
