import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CreateCartItemDto } from './dto/create-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  async addToCart(userId: string, dto: CreateCartItemDto) {
    const existing = await this.cartRepository.findOneBy({
      userId,
      productId: dto.productId,
    });

    if (existing) {
      existing.quantity += dto.quantity || 1;
      return this.cartRepository.save(existing);
    }

    const newCartItem = this.cartRepository.create({
      userId,
      productId: dto.productId,
      quantity: dto.quantity || 1,
    });

    return this.cartRepository.save(newCartItem);
  }

  async getUserCart(userId: string) {
    return this.cartRepository.find({
      where: { userId },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async removeFromCart(id: string, userId: string) {
    const item = await this.cartRepository.findOneBy({ id, userId });

    if (!item) {
      throw new NotFoundException('Savatchada bu mahsulot topilmadi');
    }

    return this.cartRepository.remove(item);
  }
}
