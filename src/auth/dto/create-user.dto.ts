import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({
    message: 'Username is required',
  })
  @IsString()
  username: string;

  @IsNotEmpty({
    message: 'Email is required',
  })
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  emailToken: string;

  @IsNotEmpty({
    message: 'Fullname is required',
  })
  @IsOptional()
  @IsString()
  fullname: string;
}
