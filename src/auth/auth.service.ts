/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
//import { PrismaService } from '../../prisma/migrations/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/users.entity';
import { PrismaService } from '../prisma.service';
import { plainToClass } from 'class-transformer';
import * as sendgrid from '@sendgrid/mail';
import * as bcrypt from 'bcrypt';

sendgrid.setApiKey(process.env.API_KEY);

const generateEmailToken = (): string => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

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
    private createUserDto: CreateUserDto,
    private prisma: PrismaService,
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.getUser(username);
    //const validPassword = await validatePassword(password, user.password)
    const validPassword = validatePassword(password, user.password);
    if (user && validPassword) {
      //const { password, username, ...rest } = user;
      return user;
    }
    return null;
  }

  async login(user: any) {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId: user.id },
    });
    const roles = userRoles.map(userRole=>userRole.roleId===1 ? 'CLIENT' : 'MANAGER')
    const payload = { username: user.username, sub: user.id, roles: roles };
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
    const hash = bcrypt.hashSync(user.password, salt);
    const createdUser = await this.prisma.user.create({
      data: {
        username: user.username,
        fullName: user.fullname,
        email: user.email,
        password: hash,
        hashActivation: emailToken,
      },
    });
    await this.sendEmailToken(createdUser.email, createdUser.hashActivation);
    return 'Verify your email';
  }

  async confirm(emailToken: string): Promise<User> {
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
    return plainToClass(User, confirmedUser);
  }
}
