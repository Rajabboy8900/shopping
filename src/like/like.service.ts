import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';

@Injectable()
export class LikeService {
    constructor(
        @InjectRepository(Like)
        private readonly likeRepository: Repository<Like>,
    ) { }

    async toggleLike(authId: string, productId: string): Promise<{ liked: boolean }> {
        try {
            const existing = await this.likeRepository.findOne({
                where: {
                    auth: { id: authId },
                    product: { productTitle: productId },
                },
            });

            if (existing) {
                await this.likeRepository.remove(existing);
                return { liked: false };
            }

            const like = this.likeRepository.create({
                auth: { id: authId } as any,
                product: { id: productId } as any,
            });

            await this.likeRepository.save(like);
            return { liked: true };
        } catch (error) {
            throw new InternalServerErrorException('Like amalida xatolik yuz berdi');
        }
    }

}

