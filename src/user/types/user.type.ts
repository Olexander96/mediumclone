import { UserEntity } from '../user.entity';

export type UserType = Omit<UserEntity, 'hashPassword'>; //ми створиди тим об'єкта user на основі його сутності UserEntity але видалили метод hashPassword бо це
