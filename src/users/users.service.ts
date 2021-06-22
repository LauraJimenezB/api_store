/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToClass } from 'class-transformer';
import { User } from './entities/users.entity';

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
      select: {
        email: true,
        username: true,
        fullName: true,
        password: true,
      },
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
}
