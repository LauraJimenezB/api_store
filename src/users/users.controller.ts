/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
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
}
