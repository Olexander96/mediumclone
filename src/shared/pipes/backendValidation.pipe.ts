import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export class BackendValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!metadata.metatype) {
      return value;
    }
    const object = plainToClass(metadata.metatype, value); //трансформує в потрібний нам об'єкт
    const errors = await validate(object); //валыдуємо
    console.log('arguments', object, errors);

    if (errors.length === 0) {
      //якщо немає помилок
      return value;
    }

    throw new HttpException(
      { errors: this.formatError(errors) }, //описуємо об'єкт який буде приходити коли помилка
      HttpStatus.UNPROCESSABLE_ENTITY,
    ); //повертаэмо помилки
  }

  formatError(errors: ValidationError[]) {
    return errors.reduce((acc, err) => {
      if (err.constraints) {
        //якщо э об'єкт з описом помилки
        acc[err.property] = Object.values(err.constraints); //робимо список помилок у відповідному форматі
      }
      return acc;
    }, {});
  }
}
