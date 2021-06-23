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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  async getAllProducts(@Query() paginationQueryDto: PaginationQueryDto) {
    return await this.productsService.getAllProducts(paginationQueryDto);
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

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  likeBook(@Request() req, @Param('id') bookId: number) {
    return this.productsService.likeBook(req.user.id, bookId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/unlike')
  unlikeBook(@Request() req, @Param('id') bookId: number) {
    return this.productsService.unlikeBook(req.user.id, bookId);
  }
}
