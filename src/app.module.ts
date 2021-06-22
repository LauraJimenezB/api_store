import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';

@Module({
    imports: [CommonModule, UsersModule, AuthModule, ProductsModule],
    controllers: [AppController],
    providers: [AppService],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { }
