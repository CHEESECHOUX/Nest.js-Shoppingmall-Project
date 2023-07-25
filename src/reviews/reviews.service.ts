import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '@src/reviews/entity/reviews.entity';
import { Repository } from 'typeorm';
import { CreateReviewDTO } from '@src/reviews/dto/reviews.dto';
import { User } from '@src/users/entity/user.entity';
import { Product } from '@src/products/entity/product.entity';
import { Order } from '@src/orders/entity/order.entity';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private reviewsRepository: Repository<Review>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
    ) {}

    async createReview(user: User, createReviewDTO: CreateReviewDTO): Promise<Review> {
        const { content, productId } = createReviewDTO;

        // 사용자가 주문한 내역
        const userOrders = await this.ordersRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.user', 'user')
            .where('user.id = :userId', { userId: user.id })
            .getMany();

        if (!userOrders.length) {
            throw new NotFoundException('사용자의 주문이 없습니다');
        }

        const userOrderIds = userOrders.map(order => order.id);

        let orderProducts = [];
        if (userOrderIds.length > 0) {
            orderProducts = await this.productsRepository
                .createQueryBuilder('product')
                .innerJoinAndSelect('product.orderProducts', 'orderProduct')
                .innerJoinAndSelect('orderProduct.order', 'order')
                .getMany();
        }

        const orderProductIds = orderProducts.map(product => product.id);
        if (!orderProductIds.includes(productId)) {
            throw new NotFoundException('사용자가 주문한 상품이 아닙니다.');
        }

        const product = await this.productsRepository.findOne({ where: { id: productId } });

        const review = new Review();
        review.content = content;
        review.product = product;
        review.user = user;

        await this.reviewsRepository.save(review);

        return review;
    }

    async updateReview(user: User, reviewId: number, createReviewDTO: CreateReviewDTO): Promise<Review> {
        const { content, productId } = createReviewDTO;

        const existingReview = await this.reviewsRepository.findOne({
            where: { id: reviewId },
            relations: ['user'],
        });

        if (!existingReview) {
            throw new NotFoundException('리뷰 정보를 찾을 수 없습니다');
        }
        if (existingReview.user.id !== user.id) {
            throw new UnauthorizedException('해당 사용자의 리뷰가 아니므로 수정할 수 없습니다');
        }

        existingReview.content = content;

        const product = await this.productsRepository.findOne({ where: { id: productId } });
        if (!product) {
            throw new NotFoundException('상품 정보를 찾을 수 없습니다');
        }

        await this.reviewsRepository.save(existingReview);

        return existingReview;
    }
}
