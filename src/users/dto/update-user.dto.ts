import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'The username.' })
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty({ description: 'The email.' })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ description: 'The password.' })
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty({ description: 'First name and last name of user.' })
  @IsString()
  @IsOptional()
  fullname: string;
}
