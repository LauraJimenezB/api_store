import { Exclude } from 'class-transformer';

export class ConfirmedUserDto {
  @Exclude()
  id: number;
  username: string;
  email: string;
  fullname: string;
  roles: string[];
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
