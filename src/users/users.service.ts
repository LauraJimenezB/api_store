import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToClass } from 'class-transformer';
import { User } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async getAllUsers(): Promise<User[] | undefined> {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async createUser(user: CreateUserDto): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        username: user.username,
        email: user.email,
        password: user.password,
      },
    });
    return plainToClass(User, createdUser);
  }

  async updateUser(id: number): Promise<User | undefined> {
    const user = this.prisma.user.findUnique({ where: { id } });
    return user;
  }

  async deleteUser(id: number): Promise<User | undefined> {
    const user = this.prisma.user.findUnique({ where: { id } });
    return user;
  }
}
