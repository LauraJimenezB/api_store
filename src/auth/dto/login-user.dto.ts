import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LogInUserDto {
  @Exclude()
  id: number;
  @Exclude()
  username: string;

  @ApiProperty({ description: 'The email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The password' })
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
