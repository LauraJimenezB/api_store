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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CartQuantityDto } from './dto/cart-quantity.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { Roles } from '../users/roles/role.decorator';
import { AttachmentsService } from '../attachments/services/attachments.service';
import { ContentTypeDto } from './dto/content-type.dto';

@ApiTags('books')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly attachmentsService: AttachmentsService,
  ) {}

  @Get()
  async getBooks(@Query() paginationQueryDto: PaginationQueryDto) {
    return await this.productsService.getAll(paginationQueryDto);
  }

  @Get(':id')
  getBook(@Param('id') id: number) {
    return this.productsService.get(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles('MANAGER')
  @Post()
  create(@Body() productDto: CreateProductDto) {
    return this.productsService.create(productDto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles('MANAGER')
  @Patch(':id')
  updateBook(@Param('id') id: number, @Body() productDto: UpdateProductDto) {
    return this.productsService.update(id, productDto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles('MANAGER')
  @Delete(':id')
  removeBook(@Param('id') id: number) {
    return this.productsService.delete(id);
  }

  @Get('category/:name')
  getByCategory(@Param('name') categoryName: string) {
    return this.productsService.getByCategory(categoryName);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles('MANAGER')
  @Post(':id/disable')
  disableBook(@Param('id') bookId: number) {
    return this.productsService.disable(bookId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles('MANAGER')
  @Post(':id/enable')
  enableBook(@Param('id') bookId: number) {
    return this.productsService.enable(bookId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  likeBook(@Request() req, @Param('id') bookId: number) {
    return this.productsService.like(req.user.id, bookId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post(':id/unlike')
  unlikeBook(@Request() req, @Param('id') bookId: number) {
    return this.productsService.unlike(req.user.id, bookId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post(':id/cart')
  addToCart(
    @Request() req,
    @Param('id') bookId: number,
    @Body() body: CartQuantityDto,
  ) {
    return this.productsService.addToCart(req.user.id, bookId, body);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles('MANAGER')
  @Post(':id/image/upload')
  createAttachment(
    @Param('id') bookId: number,
    @Body() contentType: ContentTypeDto,
  ) {
    return this.productsService.uploadImagesToBook(bookId, contentType);
  }
}
