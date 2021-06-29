import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Body,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { CreateUserDto } from './auth/dto/create-user.dto';
import { LogInUserDto } from './auth/dto/login-user.dto';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  protected(@Request() req): string {
    return req.user;
  }
}
