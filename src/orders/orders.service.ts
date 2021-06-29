import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PrismaService } from '../common/services/prisma.service';
import { ShowAllOrdersDto } from './dto/showAllorders.dto';
import { ShowOrderDto } from './dto/showorder.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async showCart(userId: number): Promise<ShowAllOrdersDto> {
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

  async showOrder(userId: number): Promise<ShowAllOrdersDto> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const sale = await this.prisma.sale.findFirst({
      where: {
        userId,
      },
    });
    if (!sale) {
      throw new NotFoundException('No orders found');
    }
    const bookSales = await this.prisma.bookSale.findMany({
      where: {
        saleId: sale.id,
      },
      include: {
        book: true,
      },
    });

    const items = bookSales.map((item) => {
      return plainToClass(ShowOrderDto, {
        bookTitle: item.book.name,
        quantity: item.quantity,
        price: item.book.price,
        priceTotal: item.book.price * item.quantity,
      });
    });
    const total = items.reduce(
      (acc: number, next: ShowOrderDto) => (acc += next.priceTotal),
      0,
    );
    return plainToClass(ShowAllOrdersDto, {
      totalamount: total,
      orders: items,
    });
  }

  async sendOrder(userId: number): Promise<ShowAllOrdersDto> {
    const getItems = await this.prisma.cart.findMany({
      where: {
        userId,
      },
      include: {
        book: true,
      },
    });
    getItems.forEach((item) => {
      if (item.book.stock < item.quantity) {
        throw new NotAcceptableException(
          'The quantity is greater that the stock available',
        );
      }
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
      await this.prisma.book.update({
        where: {
          id: item.bookId,
        },
        data: {
          stock: item.book.stock - item.quantity,
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
