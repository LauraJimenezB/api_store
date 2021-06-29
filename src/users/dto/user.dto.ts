import { Exclude } from 'class-transformer';

export class UserDto {
  username: string;
  email: string;
  fullname: string;
  roles: string[];
  fullName?: string;
  @Exclude()
  password: string;
  @Exclude()
  emailVerified: boolean;
  @Exclude()
  hashActivation: string;

  active: boolean;
  @Exclude()
  createdAt: string;
  @Exclude()
  confirmedAt: string;
}
