import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../users/users.module';
import { PrismaService } from '../common/services/prisma.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';
import { LogInUserDto } from './dto/login-user.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, AuthModule, PrismaService],
      providers: [AuthService, UsersService, PrismaService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);

    await prismaService.user.create({
      data: {
        id: 1,
        username: 'anaC',
        fullName: 'Ana Castillo',
        email: 'example123@mail.com',
        password: 'pass123',
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
