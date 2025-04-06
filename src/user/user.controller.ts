import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUserDto.dto';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDto } from './dto/loginUserDto';
import { Request } from 'express';
import { ExpressRequestInterface } from '@app/types/expressRequest.interface';
import { UserEntity } from './user.entity';
import { User } from './decorators/user.decorator';
import { AuthGuard } from './guards/auth.guard';
import { UpdateUserDto } from './dto/updateUserDto';
import { BackendValidationPipe } from '@app/shared/pipes/backendValidation.pipe';

@Controller()
export class UserController {
  constructor(private readonly userServise: UserService) {} //добавили наш сервіс в контроллер

  //Створити юзера
  @Post('users') //тут теж можна вказувати адрес
  @UsePipes(new BackendValidationPipe()) //Декоратор який валідує наші дані запиту (createuserDto).Валідація описана в createUserDto.dto.ts
  async createUser(
    @Body('user') createuserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    //@Body() - дкоратор який дає доступ до іла запиту
    const user = await this.userServise.createUser(createuserDto);
    return this.userServise.buildUserResponse(user);
  }

  //Авторизація юзера
  @Post('users/login')
  @UsePipes(new BackendValidationPipe())
  async loginUser(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userServise.loginUser(loginUserDto);
    return this.userServise.buildUserResponse(user);
  }

  //Отримати інформацію по юзеру
  @Get('users')
  @UseGuards(AuthGuard) //AuthGuard наш кастовний guard який перевіряє чи авторизований користувач
  async currentUser(
    // @Req() request: ExpressRequestInterface,
    @User() user: UserEntity, //наш кастомний декоратор
  ): Promise<UserResponseInterface> {
    //@Req() - вся інфа про запит
    // console.log('user-decorator', user);
    return this.userServise.buildUserResponse(user); //Використати оператор не-null assertion (!), якщо ви впевнені, що request.user завжди буде визначений:
  }

  //Оновити дані юзера
  @Put('users') //Якшо в запиті пароль то як його перезаписати і зашифрувати??
  @UseGuards(AuthGuard)
  async updateUser(
    @User('id') currentUserId: number,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userServise.updateUser(
      currentUserId,
      updateUserDto,
    );
    return this.userServise.buildUserResponse(user);
  }
}
