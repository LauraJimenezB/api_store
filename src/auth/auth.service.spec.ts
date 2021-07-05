import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../users/users.module';
import { PrismaService } from '../common/services/prisma.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    /* it('should return the order after buying of a user', async () => {
      const user = await authService.login('example123@mail.com', 'password');
      expect(user).toHaveProperty('access_token');
    }); */
    it('should return the order after buying of a user', async () => {
      await expect(
        authService.login('wrongEmail@mail.com', 'wrongPassword'),
      ).rejects.toThrow('User not found');
    });
    it('should return the order after buying of a user', async () => {
      await expect(
        authService.login('example123@mail.com', 'wrongPassword'),
      ).rejects.toThrow('Invalid credentials');
    });
  });

  afterAll(async () => {
    await prismaService.clearDatabase();
    await prismaService.$disconnect();
  });
});
