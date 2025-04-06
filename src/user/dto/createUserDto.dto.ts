import { IsEmail, IsNotEmpty } from 'class-validator'; //@UsePipes(new ValidationPipe()) строка в контроллері запускає всі ці декоратори для валідації

export class CreateUserDto {
  @IsNotEmpty() //валідація - не пустий
  readonly username: string;

  @IsNotEmpty()
  @IsEmail() //валідація - це імейл
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}

//DTO -В NestJS, DTO (Data Transfer Object) - це об'єкт, який використовується для визначення форми та структури даних, що передаються між шарами застосунку.
// Основні особливості та переваги використання DTO в NestJS:
// Валідація даних - DTO дозволяє визначити правила валідації за допомогою декораторів (через пакет class-validator)
// Типова безпека - визначення чіткої структури об'єктів запиту та відповіді
// Документація API - DTO використовуються для автоматичної генерації документації API (наприклад, зі Swagger)
// Розділення логіки - відокремлення структури даних від бізнес-логіки
