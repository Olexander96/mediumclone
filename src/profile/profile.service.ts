import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileResponseInterface } from './types/profileResponse.interface';
import { ProfileType } from './types/profile.type';
import { FollowEntity } from './follow.entity';

export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly profileRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
    return { profile };
  }

  async getProfile(
    currentUserId: number,
    userName: string,
  ): Promise<ProfileType> {
    const errorResponse = {
      errors: {},
    };

    const profile = await this.profileRepository.findOne({
      where: { username: userName },
    });

    if (!profile) {
      errorResponse.errors['profile'] = 'This Username does not exist!';
      throw new HttpException(errorResponse, HttpStatus.NOT_FOUND);
    }

    profile.email = 'confidentially'; //бо конфіденційна інформація

    const follow = await this.followRepository.findOne({
      //дізнаємся чи він зафоловенний нашим юзером
      where: {
        followerId: currentUserId,
        followingId: profile.id,
      },
    });

    return { ...profile, following: Boolean(follow) };
  }

  async followProfile(
    currentUserId: number,
    profileUserName: string,
  ): Promise<ProfileType> {
    const errorResponse = {
      errors: {},
    };

    const user = await this.profileRepository.findOne({
      where: { username: profileUserName },
    });

    if (!user) {
      errorResponse.errors['user'] = 'This Username does not exist!';
      throw new HttpException(errorResponse, HttpStatus.NOT_FOUND);
    }

    if (currentUserId === user.id) {
      errorResponse.errors['follower and following'] =
        'Follower and following are not equal!!';
      throw new HttpException(errorResponse, HttpStatus.BAD_REQUEST);
    }

    const follow = await this.followRepository.findOne({
      //шукаємо запис що цей юзер зафоловив цей профіль
      where: {
        followerId: currentUserId,
        followingId: user.id,
      },
    });

    if (!follow) {
      //якщо не зафоловив
      const followToCreate = new FollowEntity(); //створюємо новий запис
      followToCreate.followerId = currentUserId;
      followToCreate.followingId = user.id;
      await this.followRepository.save(followToCreate);
    }
    return { ...user, following: true };
  }

  async unfollowProfile(
    currentUserId: number,
    profileUserName: string,
  ): Promise<ProfileType> {
    const errorResponse = {
      errors: {},
    };

    const user = await this.profileRepository.findOne({
      where: { username: profileUserName },
    });

    if (!user) {
      errorResponse.errors['user'] = 'This Username does not exist!';
      throw new HttpException(errorResponse, HttpStatus.NOT_FOUND);
    }

    if (currentUserId === user.id) {
      errorResponse.errors['follower and following'] =
        'Follower and following are not equal!!';
      throw new HttpException(errorResponse, HttpStatus.BAD_REQUEST);
    }

    const unfollow = await this.followRepository.findOne({
      //шукаємо запис що цей юзер зафоловив цей профіль
      where: {
        followerId: currentUserId,
        followingId: user.id,
      },
    });

    if (unfollow) {
      await this.followRepository.delete(unfollow); //видаляємо запис
    }

    return { ...user, following: false };
  }
}
