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

    async addToCart(userId: number, createCartDTO: CreateCartDTO): Promise<Cart> {
        const { productId, quantity } = createCartDTO;

        if (!productId || productId.length === 0) {
            throw new BadRequestException('상품을 찾을 수 없습니다');
        }

        const user = await this.usersRepository.findOne({ where: { id: userId } });

        const products = await this.productsRepository
            .createQueryBuilder('product')
            .where('product.id IN (:...productIds)', { productIds: productId })
            .getMany();

        if (products.length !== productId.length) {
            throw new NotFoundException('상품을 모두 가져오지 못했습니다');
        }

        const cartItem = new Cart();
        cartItem.user = user;
        cartItem.products = products;
        cartItem.quantity = quantity;
        cartItem.totalPrice = products.reduce((total, product) => total + product.price * quantity, 0);

        return this.cartsRepository.save(cartItem);
    }
}
