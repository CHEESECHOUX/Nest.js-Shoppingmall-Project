import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ReviewsService } from '@src/reviews/reviews.service';
import { GetUserSession } from '@src/common/decorators/get-user-session.decorator';
import { User } from '@src/users/entity/user.entity';
import { Review } from '@src/reviews/entity/reviews.entity';
import { CreateReviewDTO } from '@src/reviews/dto/reviews.dto';
import { JwtAuthGuard } from '@src/users/jwt/jwt.guard';
import { RolesGuard } from '@src/guards/roles.guard';

@Controller('reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Post()
    async createReview(@GetUserSession() user: User, @Body() createReviewDTO: CreateReviewDTO): Promise<Review> {
        return this.reviewsService.createReview(user, createReviewDTO);
    }
}
