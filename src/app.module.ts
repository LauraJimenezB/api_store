import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { OrdersModule } from './orders/orders.module';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from './users/roles/guard/roles.guard'

@Module({
  imports: [
    ConfigModule.forRoot(),
    CommonModule,
    UsersModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
  ],
  providers: [
  {
    provide: APP_GUARD,
    useClass: RoleGuard,
  },
],
})
export class AppModule {}
