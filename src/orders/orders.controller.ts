import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../users/roles/role.decorator';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('mycart')
  showCart(@Request() req) {
    return this.ordersService.showCart(req.user.id);
  }

  /* @UseGuards(JwtAuthGuard)
  @Get()
  showOrder(@Request() req) {
    return this.ordersService.showOrder(req.user.id);
  } */

  @UseGuards(JwtAuthGuard)
  @Roles('MANAGER')
  @Get(':id')
  //for manager
  showOrderOfUser(@Request() req, @Param('id') userId: number) {
    return this.ordersService.showOrder(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('buy')
  sendOrder(@Request() req) {
    return this.ordersService.sendOrder(req.user.id);
  }
}
