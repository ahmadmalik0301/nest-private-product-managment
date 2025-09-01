import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

interface JwtUser {
  id: number;
  email?: string;
}

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  private async checkOwnership(id: number, user: JwtUser) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) throw new NotFoundException('This Product Does not Exist');
    if (product.userId !== user.id)
      throw new ForbiddenException("You can't access this resource");

    return product;
  }

  async create(createProductDto: CreateProductDto, user: JwtUser) {
    return this.prisma.product.create({
      data: { ...createProductDto, userId: user.id },
    });
  }

  async findAll(user: JwtUser) {
    return this.prisma.product.findMany({ where: { userId: user.id } });
  }

  async findOne(id: number, user: JwtUser) {
    return this.checkOwnership(id, user);
  }

  async update(id: number, updateProductDto: UpdateProductDto, user: JwtUser) {
    await this.checkOwnership(id, user);
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number, user: JwtUser) {
    await this.checkOwnership(id, user);
    return this.prisma.product.delete({ where: { id } });
  }
}
