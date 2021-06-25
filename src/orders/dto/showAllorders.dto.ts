import { ShowOrderDto } from './showorder.dto';

export class ShowAllOrdersDto {
  totalamount: number;
  orders: ShowOrderDto[];
}
