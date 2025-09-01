import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/Guards';
import { GetUser } from 'src/auth/decorators';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ProductResponseDto } from './dto/product-dto';

interface JwtUser {
  id: number;
  email?: string;
}

@ApiTags('Product')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create Product' })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
    type: ProductResponseDto,
  })
  async create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: JwtUser,
  ) {
    const product = await this.productService.create(createProductDto, user);
    return { product };
  }

  @Get()
  @ApiOperation({ summary: 'Get All Products of a user' })
  @ApiResponse({
    status: 200,
    description: 'List of products',
    type: [ProductResponseDto],
  })
  async findAll(@GetUser() user: JwtUser) {
    const products = await this.productService.findAll(user);
    return { products };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Product by id' })
  @ApiResponse({
    status: 200,
    description: 'The product',
    type: ProductResponseDto,
  })
  async findOne(@Param('id') id: string, @GetUser() user: JwtUser) {
    const product = await this.productService.findOne(+id, user);
    return { product };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Product by id' })
  @ApiResponse({
    status: 200,
    description: 'The updated product',
    type: ProductResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: JwtUser,
  ) {
    const product = await this.productService.update(
      +id,
      updateProductDto,
      user,
    );
    return { product };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Product by id' })
  @ApiResponse({
    status: 200,
    description: 'The deleted product',
    type: ProductResponseDto,
  })
  async remove(@Param('id') id: string, @GetUser() user: JwtUser) {
    const product = await this.productService.remove(+id, user);
    return { product };
  }
}
