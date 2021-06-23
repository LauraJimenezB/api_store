/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
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

  async getUser(username: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });
    return user;
  }

  async updateUser(id: number): Promise<User> {
    const user = this.prisma.user.findUnique({ where: { id } });
    return user;
  }

  async deleteUser(id: number): Promise<User> {
    const user = this.prisma.user.findUnique({ where: { id } });
    return user;
  }

  async setRoleToUser(userId: number, roleId: number) : Promise<User> {
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
    return plainToClass(UserDto, updatedUser);
  }
}
