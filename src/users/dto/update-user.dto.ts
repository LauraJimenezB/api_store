import { IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  username: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  password: string;

  @IsOptional()
  fullname: string;
}
