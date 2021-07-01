import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { plainToClass } from 'class-transformer';
import { User } from './entities/users.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany({
      select: {
        email: true,
        username: true,
        fullName: true,
        password: true,
      },
    });
    return plainToClass(UserDto, users);
  }

  async get(userId: number): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return plainToClass(UserDto, user);
  }

  async getByUsername(username: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });
    return user;
  }

  async update(id: number, userContent): Promise<UserDto> {
    const user = this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException();
    }

    const updatedUser = this.prisma.user.update({
      where: { id },
      data: {
        username: userContent.username,
        fullName: userContent.fullName,
        email: userContent.email,
        password: userContent.password,
      },
    });
    return plainToClass(UserDto, updatedUser);
  }

  async delete(id: number): Promise<UserDto> {
    const user = this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }
    await this.prisma.$executeRaw(
      `DELETE from "UserRole" WHERE user_id=${id};`,
    );
    await this.prisma.user.delete({
      where: { id },
    });
    return plainToClass(UserDto, user);
  }

  async setAdminRole(userId: number, roleId: number): Promise<UserDto> {
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const userRoleAlreadySet = await this.prisma.userRole.findFirst({
      where: { userId, roleId },
    });

    if (!userRoleAlreadySet) {
      await this.prisma.userRole.create({
        data: {
          userId,
          roleId,
        },
      });
    }

    const updatedUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const userWithRole = plainToClass(UserDto, updatedUser);
    const getRole = await this.prisma.userRole.findMany({
      where: { userId: userId },
    });
    const roles = getRole.map((role) =>
      role.roleId === 1 ? 'Client' : 'Manager',
    );
    userWithRole.roles = roles;
    return userWithRole;
  }

  async fillRoles() {
    await this.prisma.role.create({ data: { name: 'CLIENT' } });
    await this.prisma.role.create({ data: { name: 'MANAGER' } });
  }
}
