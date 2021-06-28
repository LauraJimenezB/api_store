import { Exclude } from 'class-transformer';
import {
  IsEmail,
  isNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class LogInUserDto {
  @Exclude()
  id: number;
  @Exclude()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  fullname: string;

  @IsOptional()
  roles: string[];

  @Exclude()
  fullName: string;
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
