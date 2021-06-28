import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from './roles/role.decorator';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('MANAGER')
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @Get(':id')
  getUser(@Param('id') id: number) {
    return this.usersService.get(id);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.delete(Number(id));
  }

  @Post('setRole/:userId/:roleId')
  setRole(@Param('userId') userId: number, @Param('roleId') roleId: number) {
    return this.usersService.setRole(Number(userId), Number(roleId));
  }
}
