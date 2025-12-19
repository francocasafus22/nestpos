import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { GetProductQueryDto } from './dto/get-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryRepository.findOneBy({
      id: createProductDto.categoryId,
    });

    if (!category) {
      const errors: string[] = [];
      errors.push('La categoría no existe');
      throw new NotFoundException(errors);
    }

    return await this.productRepository.save({
      ...createProductDto,
      category,
    });
  }

  async findAll(query: GetProductQueryDto) {
    const page = Number(query.page) || 1;
    const limit = query.take || 10;
    const skip = (page - 1) * limit;

    const options: FindManyOptions<Product> = {
      relations: {
        category: true,
      },
      order: {
        id: 'DESC',
      },
      take: limit,
      skip: skip,
    };

    if (query.category_id)
      options.where = { ...options.where, category: { id: query.category_id } };

    const [products, total] =
      await this.productRepository.findAndCount(options);

    return {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
      relations: {
        category: true,
      },
    });
    if (!product) {
      const errors: string[] = [];
      errors.push('Producto no encontrado');
      throw new NotFoundException(errors);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);

    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOneBy({
        id: updateProductDto.categoryId,
      });

      if (!category) {
        const errors: string[] = [];
        errors.push('La categoría no existe');
        throw new NotFoundException(errors);
      }
      product.category = category;
    }

    await this.productRepository.save(product);
    return `Producto actualizado correctamente`;
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return 'Producto eliminado correctamente';
  }
}
