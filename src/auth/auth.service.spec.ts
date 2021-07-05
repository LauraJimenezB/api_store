import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../users/users.module';
import { PrismaService } from '../common/services/prisma.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';
<<<<<<< HEAD
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
=======
import { LogInUserDto } from './dto/login-user.dto';
>>>>>>> 4b5ce95e65a68610f457e90f3ebe15500f6829cd

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        AuthModule,
        PrismaService,
        ConfigModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => {
            return {
              secret: configService.get<string>('JWT_SECRET'),
              signOptions: { expiresIn: configService.get<string>('JWT_EXP') },
            };
          },
          inject: [ConfigService],
        }),
      ],
      providers: [AuthService, PrismaService, JwtStrategy],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);

    await prismaService.user.create({
      data: {
        id: 1,
        username: 'anaC',
        fullName: 'Ana Castillo',
        email: 'example123@mail.com',
        password: 'password',
        hashActivation: '123456',
      },
    });
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('log in user', () => {
    const loginDto = {
      email: 'example123@mail.com',
      password: 'password',
    };
    it('should return the token if correct login', async () => {
      const user = await authService.login(loginDto);
      expect(user).toHaveProperty('access_token');
    });
    it('should return error of wrong user', async () => {
      const loginDto: LogInUserDto = {
        email: 'wrongEmail@mail.com',
        password: 'password',
      };
      await expect(authService.login(loginDto)).rejects.toThrow(
        'User not found',
      );
    });
    it('should return error of wrong password', async () => {
      const loginDto: LogInUserDto = {
        email: 'example123@mail.com',
        password: 'wrongPassword',
      };
      await expect(authService.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });

  afterAll(async () => {
    await prismaService.clearDatabase();
    await prismaService.$disconnect();
  });
});
