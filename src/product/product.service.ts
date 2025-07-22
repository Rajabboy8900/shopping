import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductCreateDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly uploadService: UploadService,
  ) {}

  // CREATE
  async createProduct(
    createProductDto: ProductCreateDto,
    files: Express.Multer.File[],
  ) {
    try {
      let imageUrls: string[] = [];

      if (files && files.length > 0) {
        imageUrls = await this.uploadService.uploadAndGetUrls(files);
      }

      const newProduct = this.productRepository.create({
        ...createProductDto,
        image: imageUrls.join(','),
      });

      return await this.productRepository.save(newProduct);
    } catch (error) {
      console.error('❌ createProduct error:', error);
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Serverda xato yuz berdi');
    }
  }

  // READ ALL
  async findAllproducts(): Promise<Product[]> {
    try {
      return await this.productRepository.find({
        relations: ['category'],
      });
    } catch (error) {
      console.error('❌ findAllproducts error:', error);
      throw new InternalServerErrorException('Serverda xato yuz berdi');
    }
  }

  // READ ONE
  async findOneproduct(id: string): Promise<Product> {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        relations: ['category'],
      });

      if (!product) {
        throw new NotFoundException('Mahsulot topilmadi');
      }

      return product;
    } catch (error) {
      console.error('❌ findOneproduct error:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Serverda xato yuz berdi');
    }
  }

  // UPDATE
  async updateproduct(
    id: string,
    updateProductDto: UpdateProductDto,
    files: Express.Multer.File[],
  ) {
    try {
      const product = await this.productRepository.findOne({ where: { id } });

      if (!product) {
        throw new NotFoundException('Mahsulot topilmadi');
      }

      let imageUrls: string[] = [];
      if (files && files.length > 0) {
        imageUrls = await this.uploadService.uploadAndGetUrls(files);
      }

      const updatedData = {
        ...updateProductDto,
        image:
          imageUrls.length > 0
            ? imageUrls.join(',')
            : product.image, // agar yangi rasm bo'lmasa, eski rasmni saqlab qoladi
      };

      await this.productRepository.update(id, updatedData);
      return await this.productRepository.findOne({ where: { id }, relations: ['category'] });
    } catch (error) {
      console.error('❌ updateProduct error:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Serverda xato yuz berdi');
    }
  }

  // DELETE
  async removeproduct(id: string) {
    try {
      const product = await this.productRepository.findOne({ where: { id } });

      if (!product) {
        throw new NotFoundException('Mahsulot topilmadi');
      }

      await this.productRepository.delete(id);
      return { message: 'Mahsulot muvaffaqiyatli o‘chirildi' };
    } catch (error) {
      console.error('❌ removeProduct error:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Serverda xato yuz berdi');
    }
  }

  // SEARCH
  async searchProducts(query: string): Promise<Product[]> {
    try {
      return await this.productRepository.find({
        where: [
          { productTitle: ILike(`%${query}%`) },
          { productDescription: ILike(`%${query}%`) },
        ],
        relations: ['category'],
      });
    } catch (error) {
      console.error('❌ searchProducts error:', error);
      throw new InternalServerErrorException('Qidiruvda xatolik yuz berdi');
    }
  }
}
