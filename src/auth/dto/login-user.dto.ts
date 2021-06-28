import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class LogInUserDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  fullname: string;

  @IsOptional()
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
