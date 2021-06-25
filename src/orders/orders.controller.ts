import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  showOrder(@Request() req) {
    return this.ordersService.showOrder(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('buy')
  sendOrder(@Request() req) {
    return this.ordersService.sendOrder(req.user.id);
  }
}
