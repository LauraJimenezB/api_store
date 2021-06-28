import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('authentication and authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  createUser(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }

  @Post(':emailToken/confirm')
  confirmEmail(@Param('emailToken') emailToken: string) {
    return this.authService.confirm(emailToken);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  protected(@Request() req): string {
    return req.user;
  }
}
