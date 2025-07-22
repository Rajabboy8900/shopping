import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Comments')
@Controller('api/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yangi izoh (comment) qo‘shish' })
  @ApiResponse({ status: 201, description: 'Comment muvaffaqiyatli yaratildi' })
  @ApiResponse({ status: 401, description: 'Ruxsat yo‘q' })
  async create(@Body() dto: CreateCommentDto) {
    return this.commentService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha commentlarni olish' })
  @ApiResponse({ status: 200, description: 'Commentlar ro‘yxati' })
  async findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Commentni ID orqali olish' })
  @ApiResponse({ status: 200, description: 'Comment topildi' })
  @ApiResponse({ status: 404, description: 'Comment topilmadi' })
  async findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Commentni yangilash' })
  @ApiResponse({ status: 200, description: 'Comment muvaffaqiyatli yangilandi' })
  @ApiResponse({ status: 404, description: 'Comment topilmadi' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.commentService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Commentni o‘chirish' })
  @ApiResponse({ status: 200, description: 'Comment o‘chirildi' })
  @ApiResponse({ status: 404, description: 'Comment topilmadi' })
  async remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
