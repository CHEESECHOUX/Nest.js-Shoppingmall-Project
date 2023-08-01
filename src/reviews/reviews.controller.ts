import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ReviewsService } from '@src/reviews/reviews.service';
import { GetUserRequest } from '@src/common/decorators/get-user-request.decorator';
import { User } from '@src/users/entity/user.entity';
import { Review } from '@src/reviews/entity/reviews.entity';
import { CreateReviewDTO } from '@src/reviews/dto/reviews.dto';
import { JwtAuthGuard } from '@src/users/jwt/jwt.guard';

@Controller('/products')
@UseGuards(JwtAuthGuard)
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Get('/reviews/:reviewId')
    async getReviewByReviewId(@Param('reviewId') reviewId: number): Promise<Review> {
        return await this.reviewsService.getReviewByReviewId(reviewId);
    }

    @Get('/:productId/reviews')
    async getReviewByProductId(@Param('productId') productId: number): Promise<Review[]> {
        return await this.reviewsService.getReviewByProductId(productId);
    }

    @Post('/reviews')
    async createReview(@GetUserRequest() user: User, @Body() createReviewDTO: CreateReviewDTO): Promise<Review> {
        return this.reviewsService.createReview(user, createReviewDTO);
    }

    @Patch('/reviews/:reviewId')
    async updateReview(
        @GetUserRequest() user: User,
        @Param('reviewId', ParseIntPipe) reviewId: number,
        @Body() createReviewDTO: CreateReviewDTO,
    ): Promise<Review> {
        return this.reviewsService.updateReview(user, reviewId, createReviewDTO);
    }

    @Delete('/reviews/:reviewId')
    async softDeleteReview(@GetUserRequest() user: User, @Param('reviewId', ParseIntPipe) reviewId: number): Promise<Review> {
        return this.reviewsService.softDeleteReview(user, reviewId);
    }
}
