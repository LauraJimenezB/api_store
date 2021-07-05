import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LogInUserDto {
  @ApiProperty({ description: 'The email', required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The password', required: true })
  @IsNotEmpty()
  @IsString()
  password: string;
}
