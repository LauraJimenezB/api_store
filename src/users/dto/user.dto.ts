import { Exclude } from 'class-transformer';

export class UserDto {
  id: number;
  username: string;
  email: string;
  fullname: string;
  roles: string[];

  @Exclude()
  password: string;

  @Exclude()
  emailVerified: boolean;

  @Exclude()
  hashActivation: string;

  @Exclude()
  createdAt: string;

  @Exclude()
  confirmedAt: string;
}
