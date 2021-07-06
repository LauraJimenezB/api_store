import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../users/entities/users.entity';
import { PrismaService } from '../common/services/prisma.service';
import { plainToClass } from 'class-transformer';
import { generateEmailToken } from '../common/helpers/activationCodeHelper';
import { compare, getHash } from '../common/helpers/cipherHelper';
import { sendEmailToken } from '../common/services/sendgrid.service';
import { ConfirmedUserDto } from './dto/confirmed-user.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { UnauthorizedException } from '@nestjs/common';
import { LogInUserDto } from './dto/login-user.dto';

function validatePassword(
  plainTextPassword: string,
  hashedPassword: string,
): boolean {
  return compare(plainTextPassword, hashedPassword);
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.getByUsername(username);
    const validPassword = validatePassword(password, user.password);
    console.log(validPassword);
    if (user && validPassword) {
      return user;
    }
    return null;
  }

  async validateAccount(id: number): Promise<UserDto> {
    return await this.usersService.get(id);
  }

  async login(loginUser: LogInUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginUser.email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const validPassword = validatePassword(loginUser.password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
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

  async logout(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  }

  async signup(user: CreateUserDto): Promise<void> {
    let userFound = await this.prisma.user.findUnique({
      where: { username: user.username },
    });
    if (userFound) {
      throw new NotAcceptableException('User is already registered');
    }
    userFound = await this.prisma.user.findUnique({
      where: { email: user.email },
    });
    if (userFound) {
      throw new NotAcceptableException('User is already registered');
    }
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
