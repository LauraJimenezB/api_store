import { Controller, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { LogInUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
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

  @Post('login')
  login(@Body() body: LogInUserDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('logout')
  logout(@Req() req) {
    return this.authService.logout(req);
  }
}
