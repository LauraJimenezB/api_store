import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  protected(@Request() req): string {
    return req.user;
  }
}
