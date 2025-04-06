import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto.dto';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateValuesMissingError } from 'typeorm';
import { sign } from 'jsonwebtoken'; //sign - функція для генерації токену JWT
import { JWT_SECRET } from '@app/config';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDto } from './dto/loginUserDto';
import { compare } from 'bcrypt';
import { UpdateUserDto } from './dto/updateUserDto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {} //через репозиторій сутності UserEntity ми можемо робити записи в табл бази даних (typeorm даэ таку змогу)

  async createUser(createuserDto: CreateUserDto): Promise<UserEntity> {
    const errorResponse = {
      //errorResponse - це об'экт який повертається при помилці (щоб було згідно документації)
      errors: {},
    };
    //Promise<UserEntity> - це проміс який поверне об'єкт тієї сутності яка потрібна нам
    //CreateUserDto - опис того що ми очікуємо (використовуємо як тип для валідації)
    const userByEmail = await this.userRepository.findOne({
      //перевіряємо запит на те чи є вже юзер з таким імейлом
      where: { email: createuserDto.email },
    });
    const userByName = await this.userRepository.findOne({
      //по імені
      where: { username: createuserDto.username },
    });

    if (userByEmail) {
      errorResponse.errors['email'] = 'has already been taken';
    }
    if (userByName) {
      errorResponse.errors['username'] = 'has already been taken';
    }

    if (userByEmail || userByName) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY); //пишемо що дані не валідні бо є такий користувач (422 помилка)
    }

    const newUser = new UserEntity(); //новий юзер це екзкмпляр сутносты UserEntity
    Object.assign(newUser, createuserDto); //перезаписуэ властивості з createuserDto в newUser
    return await this.userRepository.save(newUser);
  }

  findById(id: number): Promise<UserEntity | null> {
    //UserEntity | null бо може нічого і не повернути
    return this.userRepository.findOne({
      where: { id },
    }); //знаходимо юзера по айді
  }

  generateJwt(user: UserEntity): string {
    //генеруэмо JWT
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
    );
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const errorResponse = {
      errors: {
        'email or password': 'is invalid',
      },
    };
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
      select: ['id', 'username', 'email', 'bio', 'image', 'password'], //описуємо всі поля для того щоб повертло пароль бо в сутності UserEntity ми його приховали @Column({ select: false })
    }); //чи є вже такий користувач в базі
    // console.log('User', user);

    if (!user) {
      //якщо немає то помилка
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const isPasswordCorrect = await compare(
      loginUserDto.password,
      user.password,
    ); //звіряє захкшовний пароль в базі (user.password) з паролем в запиті логін (loginUserDto.password)

    if (!isPasswordCorrect) {
      //якщо немає то помилка
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const { password, ...userWithoutPassword } = user; //userWithoutPassword об'єкт без пароля (він нам потрібен тільки для перевірки логінізації)
    return userWithoutPassword as UserEntity; //явне приведення типів (щоб не було помилки)
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const errorResponse = {
      errors: {
        'user id': 'ID does not exist',
      },
    };
    const user = await this.findById(userId);

    if (!user) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY); //перевіряємо що точно є твкий юзер
    }

    await this.userRepository.update(
      { id: userId }, // умова пошуку користувача для оновлення
      { ...updateUserDto }, // нові дані
    );

    Object.assign(user, updateUserDto); //записуємо дані запиту з фронта (updateUserDto) в об'єкт user

    return user;
  }
}

//@Injectable()
// 1) Позначає клас як провайдер (provider) - це означає, що клас може бути керований контейнером залежностей Nest.js і доступний для впровадження в інші класи.
// 2) Дозволяє впроваджувати залежності - класи, позначені як @Injectable(), можуть мати власні залежності, вказані в конструкторі.
// 3) Інтегрується з системою життєвого циклу - Nest.js може керувати життєвим циклом провайдерів (створення, ініціалізація, знищення).
