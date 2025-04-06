import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileResponseInterface } from './types/profileResponse.interface';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { User } from '@app/user/decorators/user.decorator';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  //Отримати профіль юзера
  @Get(':username')
  async getProfile(
    @User('id') currentUserId: number,
    @Param('username') userName: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.getProfile(
      currentUserId,
      userName,
    );
    return this.profileService.buildProfileResponse(profile);
  }

  //Зафоловити (підписатися) профіль
  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(
    @User('id') currentUserId: number,
    @Param('username') profileUserName: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.followProfile(
      currentUserId,
      profileUserName,
    );
    return this.profileService.buildProfileResponse(profile);
  }

  //Розфоловити (відписатися) профіль
  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  async unfollowProfile(
    @User('id') currentUserId: number,
    @Param('username') profileUserName: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.unfollowProfile(
      currentUserId,
      profileUserName,
    );
    return this.profileService.buildProfileResponse(profile);
  }
}
