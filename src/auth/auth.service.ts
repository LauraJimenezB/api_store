import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
//import { PrismaService } from '../../prisma/migrations/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/users.entity';
import { PrismaService } from '../prisma.service';
import { plainToClass } from 'class-transformer';
import * as sendgrid from '@sendgrid/mail';

sendgrid.setApiKey(process.env.API_KEY);

const generateEmailToken = (): string => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

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

  async sendEmailToken(email: string, emailToken: string): Promise<void> {
    const msg = {
      to: email,
      from: 'hope.acmu@gmail.com', // Use the email address or domain you verified above
      subject: 'Confirm email',
      html: `http://localhost:3000/${emailToken}/confirm`,
    };

    await sendgrid.send(msg);
  }

  async signup(user: CreateUserDto): Promise<string> {
    const emailToken = generateEmailToken();
    const createdUser = await this.prisma.user.create({
      data: {
        username: user.username,
        email: user.email,
        password: user.password,
        emailToken: emailToken,
      },
    });
    await this.sendEmailToken(createdUser.email, emailToken);
    return 'Verify your email';
  }

  async confirm(token: string): Promise<User> {
    const createdUser = await this.prisma.user.findFirst({
      where: {
        emailToken: token,
      },
    });
    return plainToClass(User, createdUser);
  }
}
