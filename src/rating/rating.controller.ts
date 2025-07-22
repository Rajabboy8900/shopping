import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Rating')
@Controller('api/rating')
export class RatingController {
    constructor(private readonly ratingService: RatingService) { }

    @UseGuards(AuthGuard("jwt"))
    @ApiBearerAuth()
    @Post('add')
    @ApiOperation({ summary: 'Mahsulotga reyting qo‘shish (1-5)' })
    async addRating(@Body() dto: CreateRatingDto, @Request() req) {
        const userId = req.user.id;
        return this.ratingService.createRating(dto, userId);
    }

    @Get('average/:productId')
    @ApiOperation({ summary: 'Mahsulotning o‘rtacha reytingini olish' })
    async getAverage(@Param('productId') productId: string) {
        return {
            average: await this.ratingService.getAverageScore(productId),
        };
    }

    @Get('product/:productId')
    @ApiOperation({ summary: 'Mahsulotga berilgan reytinglar ro‘yxati' })
    async getProductRatings(@Param('productId') productId: string) {
        return this.ratingService.getProductRatings(productId);
    }
}
