import { Injectable, NotFoundException } from '@nestjs/common';
import { classToPlain, plainToClass } from 'class-transformer';
import { PrismaService } from '../common/services/prisma.service';
import { OrderDto } from './dto/order.dto';
import { SaleOrderDto } from './dto/sale-order.dto';
import { ShowAllOrdersDto } from './dto/showAllorders.dto';
import { ShowOrderDto } from './dto/showorder.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async showOrder(userId: number): Promise<ShowAllOrdersDto> {
    const getItems = await this.prisma.cart.findMany({
      where: {
        userId,
      },
      include: {
        book: true,
      },
    });

    const items = getItems.map((item) => {
      return plainToClass(ShowOrderDto, {
        bookTitle: item.book.name,
        quantity: item.quantity,
        price: item.book.price,
        priceTotal: item.book.price * item.quantity,
      });
    });
    const total = items.reduce((acc, next) => (acc += next.priceTotal), 0);
    return plainToClass(ShowAllOrdersDto, {
      totalamount: total,
      orders: items,
    });
  }

  async sendOrder(userId: number): Promise<any> {
    const getItems = await this.prisma.cart.findMany({
      where: {
        userId,
      },
      include: {
        book: true,
      },
    });
    const createdOrder = await this.prisma.sale.create({
      data: {
        saleStatus: 'Done',
        userId,
      },
    });

    getItems.forEach(async (item) => {
      await this.prisma.bookSale.create({
        data: {
          saleId: createdOrder.id,
          bookId: item.bookId,
          quantity: item.quantity,
          priceTotal: item.quantity * item.book.price,
        },
      });
    });
    await this.prisma.cart.deleteMany({
      where: {
        userId,
      },
    });
    const items = getItems.map((item) => {
      return plainToClass(ShowOrderDto, {
        bookTitle: item.book.name,
        quantity: item.quantity,
        price: item.book.price,
        priceTotal: item.book.price * item.quantity,
      });
    });
    const total = items.reduce((acc, next) => (acc += next.priceTotal), 0);
    return plainToClass(ShowAllOrdersDto, {
      totalamount: total,
      orders: items,
    });
  }
}
