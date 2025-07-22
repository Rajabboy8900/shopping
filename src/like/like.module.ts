import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Like])],
  providers: [LikeService],
  controllers: [LikeController]
})
export class LikeModule {}
