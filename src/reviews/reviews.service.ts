import { Injectable, NotFoundException } from '@nestjs/common';
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
        const { review, productId } = createReviewDTO;

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

        const createdReview = new Review();
        createdReview.review = review;
        createdReview.product = product;
        createdReview.user = user;

        await this.reviewsRepository.save(createdReview);

        return createdReview;
    }
}
