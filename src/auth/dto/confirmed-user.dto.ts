import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class ConfirmedUserDto {
  id: number;
  username: string;
  email: string;
  fullname: string;

  @ApiHideProperty()
  roles: string[];

  @ApiHideProperty()
  @Exclude()
  password: string;

  @ApiHideProperty()
  @Exclude()
  emailVerified: boolean;

  @ApiHideProperty()
  @Exclude()
  hashActivation: string;

  @ApiHideProperty()
  @Exclude()
  createdAt: string;

  @ApiHideProperty()
  @Exclude()
  confirmedAt: string;
}
