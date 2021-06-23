import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { ProductsService } from './products.service';

@ApiTags('books')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  async getAllProducts() {
    return await this.productsService.getAllProducts();
  }

  @Get(':id')
  getProduct(@Param('id') id: number) {
    return this.productsService.getProduct(id);
  }

  @Patch(':id')
  updateBook(@Param('id') id: number, @Body() body) {
    return this.productsService.updateProduct(id);
  }

  @Delete(':id')
  removeBook(@Param('id') id: number) {
    return this.productsService.deleteProduct(id);
  }
}
