import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../users/entities/users.entity';
import { PrismaService } from '../common/services/prisma.service';
import { plainToClass } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { generateEmailToken } from '../common/helpers/activationCodeHelper';
import { getHash } from '../common/helpers/cipherHelper';
import { sendEmailToken } from '../common/services/sendgrid.service';
import { ConfirmedUserDto } from './dto/confirmed-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LogInUserDto } from './dto/login-user.dto';

async function validatePassword(
  plainTextPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compareSync(plainTextPassword, hashedPassword);
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.getUserToValidate(username);
    const validPassword = validatePassword(password, user.password);
    if (user && validPassword) {
      return user;
    }
    return null;
  }

  async login(user: LogInUserDto) {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId: user.id },
    });
    const roles = userRoles.map((userRole) =>
      userRole.roleId === 1 ? 'CLIENT' : 'MANAGER',
    );
    const payload = { username: user.username, sub: user.id, roles: roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(user: CreateUserDto): Promise<VerifyEmailDto> {
    const emailToken = generateEmailToken();
    const hash = getHash(user.password);
    const createdUser = await this.prisma.user.create({
      data: {
        username: user.username,
        fullName: user.fullname,
        email: user.email,
        password: hash,
        hashActivation: emailToken,
      },
    });
    const getUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });
    await this.prisma.userRole.create({
      data: {
        userId: getUser.id,
        roleId: 1,
      },
    });
    sendEmailToken(createdUser.email, createdUser.hashActivation);
    return { status: 200, message: 'Verify your email' };
  }

  async confirm(emailToken: string): Promise<ConfirmedUserDto> {
    const user = await this.prisma.user.findFirst({
      where: {
        hashActivation: emailToken,
      },
    });
    const confirmedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        confirmedAt: new Date(),
      },
    });
    return plainToClass(ConfirmedUserDto, confirmedUser);
  }
}
