/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /* clearDatabase() {
    throw new Error('Method not implemented.');
  } */
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async clearDatabase() {
    const tableNames = ['Category', 'Book', 'User', 'Cart'];
    try {
      for (const tableName of tableNames) {
        await this.$queryRaw(`DELETE FROM "${tableName}";`);
        if (!['Store'].includes(tableName)) {
          await this.$queryRaw(
            `ALTER SEQUENCE "${tableName}_id_seq" RESTART WITH 1;`,
          );
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      await this.$disconnect();
    }
  };
}
