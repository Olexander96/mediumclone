import { UserType } from '@app/user/types/user.type';

export type ProfileType = UserType & { following: boolean };
// export type ProfileType = Omit<UserType, 'email'> & { following: boolean };
