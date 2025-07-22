import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { UploadModule } from './upload/upload.module';
import { RatingModule } from './rating/rating.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { CartModule } from './cart/cart.module';

import { UserAccount } from './auth/entities/auth.entity';
import { Category } from './category/entities/category.entity';
import { Product } from './product/entities/product.entity';
import { Comment } from './comment/entities/comment.entity';
import { Rating } from './rating/entities/rating.entity';
import { Like } from './like/entities/like.entity';
import { Cart } from './cart/entities/cart.entity';

@Module({
  imports: [
    // .env faylni o‘qish uchun global config
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

    // TypeORM asosiy DB sozlamalari
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [UserAccount, Category, Product, Comment, Rating, Like, Cart],
      synchronize: false, 
  migrationsRun: true,
  logging: ['error', 'warn'],
    }),

    // Modul importlari
    AuthModule,
    EmailModule,
    CategoryModule,
    ProductModule,
    UploadModule,
    RatingModule,
    CommentModule,
    LikeModule,
    CartModule,
  ],
})
export class AppModule {}
