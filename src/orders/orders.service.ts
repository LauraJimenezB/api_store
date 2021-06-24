import { Injectable, NotFoundException } from '@nestjs/common';
import { classToPlain, plainToClass } from 'class-transformer';
import { PrismaService } from '../common/services/prisma.service';
import { OrderDto } from './dto/order.dto';
import { SaleOrderDto } from './dto/sale-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async showOrder(userId: number): Promise<any> {
    const getItems = await this.prisma.cartItem.findMany({
      where: {
        userId,
      },
    });

    const items = getItems.map(async (item) => {
      const book = await this.prisma.book.findUnique({
        where: {
          id: item.bookId,
        },
      });
      const newItem = plainToClass(OrderDto, item);
      newItem.bookTitle = book.name;
      return newItem;
    });

    return items;
  }

  async sendOrder(userId: number): Promise<any> {
    const getItems = await this.prisma.cartItem.findMany({
      where: {
        userId,
      },
    });

    const priceTotal = getItems.reduce((a, b) => +a + +b.price, 0);

    const createdOrder = await this.prisma.sale.create({
      data: {
        saleStatus: 'pending',
        userId,
        totalPrice: priceTotal,
      },
    });

    await this.prisma.cartItem.updateMany({
      where: {
        userId,
      },
      data: {
        saleId: createdOrder.id,
      },
    });

    const getOrder = await this.prisma.sale.findUnique({
      where: {
        id: createdOrder.id,
      },
    });
    const saleOrder = plainToClass(SaleOrderDto, getOrder);
    saleOrder.items = plainToClass(OrderDto, getItems);

    return saleOrder;
  }
}
