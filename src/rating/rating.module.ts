import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from './entities/rating.entity';
import { Product } from '../product/entities/product.entity';
import { UserAccount } from '../auth/entities/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, Product, UserAccount])],
  controllers: [RatingController],
  providers: [RatingService],
})
export class RatingModule {}
