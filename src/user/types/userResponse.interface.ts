import { UserType } from './user.type';

export interface UserResponseInterface {
  //це інтерфейс який описує об'єкт який буде повертатися (ми його задаємо як тип для різних методів та функцій)
  user: UserType & { token: string };
}
