import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '@src/carts/entity/carts.entity';
import { CreateCartDTO } from '@src/carts/dto/carts.dto';
import { User } from '@src/users/entity/user.entity';
import { Product } from '@src/products/entity/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CartsService {
    constructor(
        @InjectRepository(Cart)
        private cartsRepository: Repository<Cart>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) {}

    async getCartByUserId(userId: number): Promise<Cart[]> {
        const carts = await this.cartsRepository
            .createQueryBuilder('cart')
            .innerJoin('cart.user', 'user')
            .where('user.id = :userId', { userId })
            .orderBy('cart.updatedAt', 'DESC')
            .getMany();

        return carts;
    }

    async addToCart(userId: number, createCartDTO: CreateCartDTO): Promise<Cart> {
        const { cartItems } = createCartDTO;

        if (!cartItems || cartItems.length === 0) {
            throw new BadRequestException('상품을 찾을 수 없습니다');
        }

        const user = await this.usersRepository.findOne({ where: { id: userId } });
        const productId = cartItems.map(product => product.productId);
        const quantity = cartItems.map(product => product.quantity);

        const foundProducts = await this.productsRepository
            .createQueryBuilder('product')
            .where('product.id IN (:...productId)', { productId: productId })
            .getMany();

        if (foundProducts.length !== productId.length) {
            throw new NotFoundException('상품을 모두 가져오지 못했습니다');
        }

        const totalQuantity = quantity.reduce((total, q) => total + q, 0);

        const cartItem = new Cart();
        cartItem.user = user;
        cartItem.products = foundProducts;
        cartItem.quantity = totalQuantity;

        cartItem.totalPrice = foundProducts.reduce((total, product) => {
            const productItem = cartItems.find(item => item.productId === product.id);
            return total + product.price * productItem.quantity;
        }, 0);

        return this.cartsRepository.save(cartItem);
    }
}
