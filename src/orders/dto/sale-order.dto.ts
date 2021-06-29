import { Exclude } from 'class-transformer';
import { OrderDto } from './order.dto';

export class SaleOrderDto {
  @Exclude()
  id: number;

  @Exclude()
  userId: number;

  @Exclude()
  bookId: number;

  @Exclude()
  username: string;

  @Exclude()
  saleId: number;

  bookTitle: string;
  quantity: number;

  items: OrderDto[];
}
