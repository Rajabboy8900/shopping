import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { LikeService } from './like.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LikeProductDto } from './dto/like-toggle.dto';

@ApiTags('Like')
@ApiBearerAuth()
@Controller('api/like')
export class LikeController {
    constructor(private readonly likeService: LikeService) { }
    @Post('toggle')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Toggle like for a product' })
    @ApiResponse({ status: 500, description: 'Serverda xato yuz berdi' })
    @ApiResponse({ status: 201, description: "muvafaciyatli ishlandi" })
    @ApiBody({ type: LikeProductDto })
    async toggleLike(
        @Req() req,
        @Body() dto: LikeProductDto,
    ) {
        const authId = req.user.id;
        return this.likeService.toggleLike(authId, dto.productId);
    }
}


