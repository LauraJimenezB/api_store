import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../users/users.module';
import { PrismaService } from '../common/services/prisma.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, AuthModule],
      providers: [AuthService, UsersService, PrismaService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
