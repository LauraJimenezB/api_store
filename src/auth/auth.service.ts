import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
//import { PrismaService } from '../../prisma/migrations/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/users.entity';
import { PrismaService } from '../prisma.service';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private createUserDto: CreateUserDto,
    private prisma: PrismaService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.getUser(username);

    if (user && user.password === password) {
      const { password, username, ...rest } = user;
      return rest;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(user: CreateUserDto): Promise<string> {
    await this.prisma.user.create({
      data: {
        username: user.username,
        email: user.email,
        password: user.password,
      },
    });
    return 'Verify your email';
  }

  async confirm(userId: number): Promise<User> {
    const createdUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return plainToClass(User, createdUser);
  }
}
