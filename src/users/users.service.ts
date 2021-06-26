/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToClass } from 'class-transformer';
import { User } from './entities/users.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async getAllUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      select: {
        email: true,
        username: true,
        fullName: true,
        password: true,
      },
    });
    return users;
  }

  async getUser(userId: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if(!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async getUserToValidate(username: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });
    return user;
  }

  async updateUser(id: number, userContent): Promise<User> {
    const user = this.prisma.user.findUnique({ where: { id } });

    if(!user) {
      throw new NotFoundException();
    }

    const updatedUser = this.prisma.user.update({ where: { id }, data:{
      username: userContent.username,
      fullName: userContent.fullName,
      email: userContent.email,
      password: userContent.password,
    } });
    return updatedUser;
  }

  async deleteUser(id: number): Promise<User> {
    const user = this.prisma.user.delete({ where: { id } });

    if(!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async setRoleToUser(userId: number, roleId: number) : Promise<UserDto> {
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if(!userExists) {
      throw new NotFoundException();
    }

    const roleExists = await this.prisma.role.findUnique({
      where: { id: roleId },
    });

    if(!roleExists) {
      throw new NotFoundException();
    }

    const userRoleAlreadySet = await this.prisma.userRole.findFirst({
      where: { userId, roleId },
    });

    if (!userRoleAlreadySet) {
      await this.prisma.userRole.create({
        data: {
          userId,
          roleId
        },
      })
    }

    const updatedUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const userWithRole = plainToClass(UserDto, updatedUser);
    const getRole = await this.prisma.userRole.findMany({
      where: { userId: userId },
    });
    const roles = getRole.map((role)=>role.roleId===1 ? 'Client' : "Manager");
    userWithRole.roles = roles;
    return userWithRole;
  }
}
