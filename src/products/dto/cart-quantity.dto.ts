import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CartQuantityDto {
  @ApiProperty({ description: 'The quantity.' })
  @IsNumber()
  @IsNotEmpty()
  readonly quantity: number;
}
