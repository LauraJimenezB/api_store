import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles/role.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('mycart')
  showCart(@Request() req) {
    return this.ordersService.showCart(req.user.id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles('MANAGER')
  @Get(':id')
  showOrderOfUser(@Request() req, @Param('id') userId: number) {
    return this.ordersService.showOrder(userId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('buy')
  sendOrder(@Request() req) {
    return this.ordersService.sendOrder(req.user.id);
  }
}
