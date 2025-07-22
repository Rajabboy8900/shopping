import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { Product } from 'src/product/entities/product.entity';
import { UserAccount } from 'src/auth/entities/auth.entity';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepo: Repository<Rating>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async createRating(
    dto: CreateRatingDto,
    authUser: UserAccount,
  ): Promise<Rating> {
    try {
      const product = await this.productRepo.findOneBy({ id: dto.productId });
      if (!product) {
        throw new NotFoundException('Mahsulot topilmadi');
      }

      const newRating = this.ratingRepo.create({
        product: product,
        user: authUser,
        score: dto.value,
      });

      return await this.ratingRepo.save(newRating);
    } catch (error) {
      throw new InternalServerErrorException('Reyting yaratishda xatolik yuz berdi');
    }
  }

  async getAverageScore(productId: string): Promise<number> {
    const ratings = await this.ratingRepo.find({
      where: {
        product: { id: productId },
      },
    });

    if (ratings.length === 0) return 0;

    const total = ratings.reduce((acc, rating) => acc + rating.score, 0);
    return parseFloat((total / ratings.length).toFixed(1));
  }

  async getProductRatings(productId: string): Promise<Rating[]> {
    const ratings = await this.ratingRepo.find({
      where: {
        product: { id: productId },
      },
      relations: ['user'],
      order: { ratedAt: 'DESC' },
    });

    if (!ratings || ratings.length === 0) {
      throw new NotFoundException('Reytinglar topilmadi');
    }

    return ratings;
  }
}
