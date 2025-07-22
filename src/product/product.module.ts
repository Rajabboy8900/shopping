import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { UploadModule } from 'src/upload/upload.module'

@Module({
    imports: [TypeOrmModule.forFeature([Product]), 
            UploadModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
