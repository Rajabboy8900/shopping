import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Product } from 'src/product/entities/product.entity';
import { UserAccount } from 'src/auth/entities/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Product, UserAccount])],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule {}
