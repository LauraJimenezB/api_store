import { Exclude } from 'class-transformer';

export class OrderDto {
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
}
