import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Product } from '../product/entities/product.entity';
import { UserAccount } from '../auth/entities/auth.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(UserAccount)
    private readonly userRepository: Repository<UserAccount>,
  ) {}

  async create(dto: CreateCommentDto): Promise<Comment> {
    const product = await this.productRepository.findOne({
      where: {
        productTitle: dto.productId,
      },
    });
    if (!product) throw new NotFoundException('Mahsulot topilmadi');

    const user = await this.userRepository.findOne({
      where: {
        id: dto.userId,
      },
    });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

    const comment = this.commentRepository.create({
      text: dto.text,
      product: product,
      auth: user,
    });

    return this.commentRepository.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return this.commentRepository.find({
      relations: ['product', 'auth'],
    });
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['product', 'auth'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment #${id} topilmadi`);
    }

    return comment;
  }

  async update(id: string, dto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.commentRepository.preload({
      id,
      ...dto,
    });

    if (!comment) {
      throw new NotFoundException(`Comment #${id} topilmadi`);
    }

    return this.commentRepository.save(comment);
  }

  async remove(id: string): Promise<{ message: string }> {
    const comment = await this.commentRepository.findOneBy({ id });

    if (!comment) {
      throw new NotFoundException(`Comment #${id} topilmadi`);
    }

    await this.commentRepository.remove(comment);
    return { message: 'Comment o‘chirildi!' };
  }
}