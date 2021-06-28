import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LogInUserDto {
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'The username.' })
  @IsString()
  @IsNotEmpty()
  username: string;

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
