import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class AuthService {}
