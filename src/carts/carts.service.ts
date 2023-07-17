import { Injectable } from '@nestjs/common';
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

    async createCart(createCartDTO: CreateCartDTO): Promise<Cart> {
        const { userId, productId, quantity } = createCartDTO;

        const user = await this.usersRepository.findOne({ where: { id: userId } });
        const product = await this.productsRepository.findOne({ where: { id: productId } });
        const totalPrice = product.price * quantity;

        const cart = new Cart();
        cart.user = new User();
        cart.user.id = userId;
        cart.product = new Product();
        cart.product.id = productId;
        cart.quantity = quantity;
        cart.totalPrice = totalPrice;

        const createdCart = await this.cartsRepository.save(cart);

        return createdCart;
    }
}
