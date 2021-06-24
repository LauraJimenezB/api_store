import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('books')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  async getBooks(@Query() paginationQueryDto: PaginationQueryDto) {
    return await this.productsService.getAll(paginationQueryDto);
  }

  @Get(':id')
  getBook(@Param('id') id: number) {
    return this.productsService.get(id);
  }

  @Post()
  create(@Body() productDto: CreateProductDto) {
    return this.productsService.create(productDto);
  }

  @Patch(':id')
  updateBook(@Param('id') id: number, @Body() productDto: UpdateProductDto) {
    return this.productsService.update(id, productDto);
  }

  @Delete(':id')
  removeBook(@Param('id') id: number) {
    return this.productsService.delete(id);
  }

  @Get('category/:name')
  getByCategory(@Request() req, @Param('name') categoryName: string) {
    return this.productsService.getByCategory(categoryName);
  }

  @Post(':id/disable')
  disableBook(@Request() req, @Param('id') bookId: number) {
    return this.productsService.disable(bookId);
  }

  @Post(':id/enable')
  enableBook(@Request() req, @Param('id') bookId: number) {
    return this.productsService.enable(bookId);
  }

  @Post(':id/like')
  likeBook(@Request() req, @Param('id') bookId: number) {
    return this.productsService.like(req.user.id, bookId);
  }

  @Post(':id/unlike')
  unlikeBook(@Request() req, @Param('id') bookId: number) {
    return this.productsService.unlike(req.user.id, bookId);
  }
}
