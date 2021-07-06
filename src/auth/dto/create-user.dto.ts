import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'The username.' })
  @IsString()
  @IsNotEmpty({
    message: 'Username is required',
  })
  username: string;

  @ApiProperty({ description: 'The email.' })
  @IsNotEmpty({
    message: 'Email is required',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The password.' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiHideProperty()
  @IsOptional()
  emailToken: string;

  @ApiProperty({ description: 'First name and last name of user.' })
  @IsString()
  @IsNotEmpty({
    message: 'fullName is required',
  })
  fullName: string;
}
