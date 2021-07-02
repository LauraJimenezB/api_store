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
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getUser(@Param('id') id: number) {
    return this.usersService.get(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('setAdminRole/:userId/:roleId')
  setRole(@Param('userId') userId: number, @Param('roleId') roleId: number) {
    return this.usersService.setAdminRole(userId, roleId);
  }

  @Post('fillRoles')
  fillRoles() {
    return this.usersService.fillRoles();
  }
}
