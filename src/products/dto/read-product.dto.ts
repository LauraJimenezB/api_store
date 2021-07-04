import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class ReadProductDto {
  name: string;
  authors: string[];
  editorial: string;
  price: number;
  stock: number;
  categoryName: string;
  disabled: boolean;
  favourites: number;
  categoryId: number;

  @ApiHideProperty()
  @Exclude()
  category;
}
