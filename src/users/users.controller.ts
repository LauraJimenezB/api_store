/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { RoleGuard } from './roles/guard/roles.guard';
import { Roles } from './roles/role.decorator';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @Roles('MANAGER')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  /* @Get(':id')
  getUser(@Param('id') username: string) {
    return this.usersService.getUser(username);
  } */

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() body) {
    return this.usersService.updateUser(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.deleteUser(Number(id));
  }

  @Post('setRole/:userId/:roleId')
  setRole(@Param('userId') userId: number, @Param('roleId') roleId: number) {
    return this.usersService.setRoleToUser(Number(userId), Number(roleId));
  }
}