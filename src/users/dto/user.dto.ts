import { Exclude } from 'class-transformer';

export class UserDto {
  username: string;
  email: string;
  fullname: string;
  role: string;
  @Exclude()
  fullName: string;
  @Exclude()
  password: string;
  @Exclude()
  emailVerified: boolean;
  @Exclude()
  hashActivation: string;
  @Exclude()
  active: boolean;
  @Exclude()
  createdAt: string;
  @Exclude()
  confirmedAt: string;
}
