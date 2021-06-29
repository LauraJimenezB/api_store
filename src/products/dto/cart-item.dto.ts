import { Exclude } from 'class-transformer';

export class CartItemDto {
  @Exclude()
  id: number;

  @Exclude()
  userId: number;

  @Exclude()
  bookId: number;

  @Exclude()
  username: string;

  bookTitle: string;
  quantity: number;
}
