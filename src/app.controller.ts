import {
    Controller,
    Get,
    Request,
    Post,
    UseGuards,
    Body,
    Param,
} from '@nestjs/common';
//import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    createUser(@Body() body) {
        return this.authService.signup(body);
    }

  @Post(':emailToken/confirm')
  confirmEmail(@Param('emailToken') emailToken: string) {
    return this.authService.confirm(emailToken);
  }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Request() req): any {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('protected')
    protected(@Request() req): string {
        return req.user;
    }
}
