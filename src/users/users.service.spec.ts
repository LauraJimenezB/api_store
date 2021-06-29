import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../common/services/prisma.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let userService: UsersService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaService],
      providers: [UsersService, PrismaService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);

    userService = new UsersService(prismaService);

    await prismaService.user.createMany({
      data: [
        {
          id: 1,
          username: 'anaC',
          fullName: 'Ana Castillo',
          email: 'example123@mail.com',
          password: 'pass123',
          hashActivation: '123456',
        },
        {
          id: 2,
          username: 'MartG',
          fullName: 'Martin Gonzales',
          email: 'martin456@mail.com',
          password: 'pass456',
          hashActivation: '456789',
        },
      ],
    });
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return a json with all users', async () => {
      const allUsers = await userService.getAllUsers();
      expect(allUsers).toHaveLength(2);
      const fullname = allUsers.map((user) => user.fullName);
      expect(fullname).toContain('Ana Castillo');
      expect(fullname).toContain('Martin Gonzales');
    });
  });

  describe('get single user', () => {
    it('should return a user', async () => {
      const user = await userService.get(1);
      expect(user.fullName).toBe('Ana Castillo');
      expect(user.email).toBe('example123@mail.com');
    });
    it('should throw an error when user does not exists in the database', async () => {
      await expect(userService.get(6)).rejects.toThrow('Not Found');
    });
  });

  describe('update user', () => {
    it('should return the updated user', async () => {
      const user = await userService.update(1, { username: 'Ana1246' });
      expect(user.username).toBe('Ana1246');
    });
    it('should throw an error when user does not exists in the database', async () => {
      await expect(
        userService.update(6, { email: 'ex@mail.com' }),
      ).rejects.toThrow(
        'An operation failed because it depends on one or more records that were required but not found. Record to update not found.',
      );
    });
  });

  describe('set role to user', () => {
    /* it('should return a user', async () => {
      const user = await userService.setAdminRole(1);
      console.log(user);
      expect(user.username).toBe('Ana1246');
      expect(user.roles).toContain('Manager');
    }); */
    it('should throw an error when user does not exists in the database', async () => {
      await expect(userService.setAdminRole(6)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('delete user', () => {
    it('should return the deleted user', async () => {
      const user = await userService.delete(2);
      expect(user.fullName).toBe('Martin Gonzales');
      expect(user.email).toBe('martin456@mail.com');
    });
    it('should throw an error when user does not exists in the database', async () => {
      await expect(userService.delete(6)).rejects.toThrowError(
        PrismaClientKnownRequestError,
      );
    });
  });

  afterAll(async () => {
    await prismaService.clearDatabase();
    await prismaService.$disconnect();
  });
});
