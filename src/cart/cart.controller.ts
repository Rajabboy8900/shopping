import {
    Controller,
    Post,
    Get,
    Delete,
    Body,
    UseGuards,
    Req,
    Param,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiBody,
    ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('api/cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Post('add')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Add product to cart' })
    @ApiBody({
        description: 'Product ID to add to cart',
        type: CreateCartItemDto,
        examples: {
            example1: {
                summary: 'Add a product',
                value: {
                    productId: 1,
                },
            },
        },
    })
    async addToCart(@Req() req, @Body() dto: CreateCartItemDto) {
        const authId = req.user.id;
        return this.cartService.addToCart(authId, dto);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get user cart' })
    async getCart(@Req() req) {
        const authId = req.user.id;
        return this.cartService.getUserCart(authId);
    }

    @Delete('remove/:id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Remove item from cart' })
    @ApiParam({ name: 'id', type: String, description: 'Product ID to remove' })
    async removeFromCart(@Param('id') id: string, @Req() req) {
        const authId = req.user.id;
        return this.cartService.removeFromCart(id, authId);
    }
}
