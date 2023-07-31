import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '@src/reviews/entity/reviews.entity';
import { Repository } from 'typeorm';
import { CreateReviewDTO } from '@src/reviews/dto/reviews.dto';
import { User } from '@src/users/entity/user.entity';
import { Product } from '@src/products/entity/product.entity';
import { Order } from '@src/orders/entity/order.entity';
import { UserRole } from '@src/users/entity/user-role.entity';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private reviewsRepository: Repository<Review>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        @InjectRepository(UserRole)
        private userRolesRepository: Repository<UserRole>,
    ) {}

    async getReviewByReviewId(reviewId: number): Promise<Review> {
        const review = await this.reviewsRepository.findOne({ where: { id: reviewId } });
        if (!review) {
            throw new UnauthorizedException('리뷰를 찾을 수 없습니다');
        }

        return review;
    }

    async getReviewByProductId(productId: number): Promise<Review[]> {
        try {
            const reviews = await this.reviewsRepository
                .createQueryBuilder('review')
                .innerJoin('review.product', 'product')
                .where('product.id = :productId', { productId })
                .orderBy('review.updatedAt', 'DESC')
                .take(20)
                .getMany();

            return reviews;
        } catch (e) {
            console.error('상품 리뷰 조회 중 에러 발생 :', e.message);
            throw new Error('상품의 리뷰를 가져오는데 실패했습니다.');
        }
    }

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

    async softDeleteReview(user: User, reviewId: number): Promise<Review> {
        const review = await this.reviewsRepository.findOne({
            where: { id: reviewId },
            relations: ['user'],
        });

        if (!review) {
            throw new NotFoundException('리뷰 정보를 찾을 수 없습니다');
        }

        const isUserAdmin = await this.userRolesRepository.findOne({ where: { user: { id: user.id }, role: { role: 'ADMIN' } } });
        const isReviewAuthor = review.user?.id === user.id;

        if (!isUserAdmin && !isReviewAuthor) {
            throw new UnauthorizedException('사용자가 작성한 리뷰 or ADMIN 권한만 리뷰를 삭제할 수 있습니다');
        }

        await this.reviewsRepository.update({ id: reviewId }, { isDeleted: true });

        return review;
    }
}
