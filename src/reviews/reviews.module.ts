import { Module } from '@nestjs/common';
import { ReviewsService } from '@src/reviews/reviews.service';
import { ReviewsController } from '@src/reviews/reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from '@src/reviews/entity/reviews.entity';
import { Product } from '@src/products/entity/product.entity';
import { Order } from '@src/orders/entity/order.entity';
import { UserRole } from '@src/users/entity/user-role.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Review, Product, Order, UserRole])],
    providers: [ReviewsService],
    controllers: [ReviewsController],
})
export class ReviewsModule {}
