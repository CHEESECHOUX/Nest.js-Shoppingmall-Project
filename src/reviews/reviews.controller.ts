import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ReviewsService } from '@src/reviews/reviews.service';
import { GetUserSession } from '@src/common/decorators/get-user-session.decorator';
import { User } from '@src/users/entity/user.entity';
import { Review } from '@src/reviews/entity/reviews.entity';
import { CreateReviewDTO } from '@src/reviews/dto/reviews.dto';
import { JwtAuthGuard } from '@src/users/jwt/jwt.guard';

@Controller('products/reviews')
@UseGuards(JwtAuthGuard)
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Post()
    async createReview(@GetUserSession() user: User, @Body() createReviewDTO: CreateReviewDTO): Promise<Review> {
        return this.reviewsService.createReview(user, createReviewDTO);
    }

    @Patch(':reviewId')
    async updateReview(
        @GetUserSession() user: User,
        @Param('reviewId', ParseIntPipe) reviewId: number,
        @Body() createReviewDTO: CreateReviewDTO,
    ): Promise<Review> {
        return this.reviewsService.updateReview(user, reviewId, createReviewDTO);
    }

    @Delete(':reviewId')
    async softDeleteReview(@GetUserSession() user: User, @Param('reviewId', ParseIntPipe) reviewId: number): Promise<Review> {
        return this.reviewsService.softDeleteReview(user, reviewId);
    }
}
