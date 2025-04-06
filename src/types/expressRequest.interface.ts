import { UserEntity } from '@app/user/user.entity';
import { Request } from 'express';

export interface ExpressRequestInterface extends Request {
  //описуємо інтерфейс запиту, юзер може бути а може і ні
  user?: UserEntity | null;
}
