import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LogInUserDto {
  @Exclude()
  id: number;

  @ApiHideProperty()
  @Exclude()
  username: string;

  @ApiProperty({ description: 'The email', required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The password', required: true })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiHideProperty()
  @IsOptional()
  @IsString()
  fullname: string;

  @ApiHideProperty()
  @IsOptional()
  roles: string[];

  @ApiHideProperty()
  @Exclude()
  fullName: string;

  @ApiHideProperty()
  @Exclude()
  emailVerified: boolean;

  @ApiHideProperty()
  @Exclude()
  hashActivation: string;

  @ApiHideProperty()
  @Exclude()
  active: boolean;

  @ApiHideProperty()
  @Exclude()
  createdAt: string;

  @ApiHideProperty()
  @Exclude()
  confirmedAt: string;
}
