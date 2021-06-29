import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../users/users.module';
import { PrismaService } from '../common/services/prisma.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';

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

  describe('log in', () => {
    it('should return the order after buying of a user', async () => {
      const user = await authService.login('example123@mail.com', 'pass123');
      console.log(user);
    });
  });

  afterAll(async () => {
    await prismaService.clearDatabase();
    await prismaService.$disconnect();
  });
});
