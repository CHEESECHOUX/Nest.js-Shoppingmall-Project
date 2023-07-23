import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '@src/carts/entity/carts.entity';
import { CreateCartDTO, UpdateCartDTO } from '@src/carts/dto/carts.dto';
import { User } from '@src/users/entity/user.entity';
import { Product } from '@src/products/entity/product.entity';
import { Repository } from 'typeorm';
import { CartInfoDTO } from '@src/carts/dto/carts.dto';
import { CartItem } from '@src/carts/entity/cart-items.entity';

@Injectable()
export class CartsService {
    constructor(
        @InjectRepository(Cart)
        private cartsRepository: Repository<Cart>,
        @InjectRepository(CartItem)
        private cartItemsRepository: Repository<CartItem>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) {}

    async getCartByUser(user: User): Promise<Cart | null> {
        const cart = await this.cartsRepository
            .createQueryBuilder('cart')
            .innerJoinAndSelect('cart.user', 'user')
            .where('user.id = :userId', { userId: user.id })
            .getOne();

        if (!cart) {
            throw new NotFoundException('장바구니를 찾을 수 없습니다');
        }

        return cart;
    }

    async createCart(userId: number, createCartDTO: CreateCartDTO): Promise<Cart> {
        const { cartItems } = createCartDTO;
        if (!cartItems || cartItems.length === 0) {
            throw new BadRequestException('상품을 찾을 수 없습니다');
        }

        const existingCart = await this.cartsRepository.findOne({ where: { id: userId } });
        if (existingCart) {
            throw new BadRequestException('이미 장바구니가 존재합니다. 장바구니는 한 개만 만들 수 있습니다');
        }

        const user = await this.usersRepository.findOne({ where: { id: userId } });
        const productIds = cartItems.map(product => product.productId);

        const foundProducts = await this.productsRepository
            .createQueryBuilder('product')
            .where('product.id IN (:...productIds)', { productIds: productIds })
            .getMany();

        if (foundProducts.length !== productIds.length) {
            throw new NotFoundException('상품정보를 DB에서 가져오지 못했습니다');
        }

        const totalQuantity = cartItems.reduce((total, { quantity }) => total + quantity, 0);

        const totalAmount = foundProducts.reduce((total, product) => {
            const productItem = cartItems.find(item => item.productId === product.id);
            return total + product.price * productItem.quantity;
        }, 0);

        const cart = new Cart();
        cart.user = user;
        cart.totalQuantity = totalQuantity;
        cart.totalAmount = totalAmount;

        const savedCart = await this.cartsRepository.save(cart);

        const cartItemsToSave = cartItems.map(cartItemDTO => {
            const foundProduct = foundProducts.find(product => product.id === cartItemDTO.productId);
            if (!foundProduct) {
                throw new NotFoundException(`상품 ID ${cartItemDTO.productId}에 해당하는 상품을 찾을 수 없습니다`);
            }
            const cartItem = new CartItem();
            cartItem.product = foundProduct;
            cartItem.quantity = cartItemDTO.quantity;
            cartItem.cart = savedCart;
            return this.cartItemsRepository.save(cartItem);
        });

        return savedCart;
    }

    async updateCart(userId: number, updateCartDTO: UpdateCartDTO): Promise<Cart> {
        const { cartItems, cartId } = updateCartDTO;

        const user = await this.usersRepository.findOne({ where: { id: userId } });

        const cart = await this.cartsRepository.findOne({
            where: { id: cartId },
            relations: ['user'],
        });

        if (!cart) {
            throw new NotFoundException('장바구니 정보를 찾을 수 없습니다');
        }
        if (cart.user?.id !== userId && user.role !== 'ADMIN') {
            throw new UnauthorizedException('해당 사용자의 장바구니 or ADMIN 권한이 아니므로 수정할 수 없습니다');
        }

        const productId = cartItems.map(product => product.productId);

        const foundProducts = await this.productsRepository
            .createQueryBuilder('product')
            .where('product.id IN (:...productId)', { productId: productId })
            .getMany();

        const totalQuantity = cartItems.reduce((total, { quantity }) => total + quantity, 0);

        const totalAmount = foundProducts.reduce((total, product) => {
            const productItem = cartItems.find(item => item.productId === product.id);
            return total + product.price * productItem.quantity;
        }, 0);

        const updatedCart = new Cart();
        updatedCart.user = user;
        updatedCart.totalQuantity = totalQuantity;
        updatedCart.totalAmount = totalAmount;

        const savedCart = await this.cartsRepository.save(updatedCart);

        const updatedCartItem = cartItems.map(cartItemDTO => {
            const foundProduct = foundProducts.find(product => product.id === cartItemDTO.productId);
            if (!foundProduct) {
                throw new NotFoundException(`상품 ID ${cartItemDTO.productId}에 해당하는 상품을 찾을 수 없습니다`);
            }
            const cartItem = new CartItem();
            cartItem.product = foundProduct;
            cartItem.quantity = cartItemDTO.quantity;
            cartItem.cart = savedCart;
            return this.cartItemsRepository.save(cartItem);
        });

        return savedCart;
    }

    async softDeleteCartItem(userId: number, updateCartDTO: UpdateCartDTO): Promise<Cart> {
        const { cartItems, cartId } = updateCartDTO;

        const user = await this.usersRepository.findOne({ where: { id: userId } });

        const cart = await this.cartsRepository.findOne({
            where: { id: cartId },
            relations: ['user'],
        });

        if (!cart) {
            throw new NotFoundException('장바구니 정보를 찾을 수 없습니다');
        }
        if (cart.user?.id !== userId && user.role !== 'ADMIN') {
            throw new UnauthorizedException('해당 사용자의 장바구니 or ADMIN 권한이 아니므로 수정할 수 없습니다');
        }

        const productIdList = cartItems.map(item => item.productId);
        const quantityList = cartItems.map(item => item.quantity);

        const products = await this.productsRepository
            .createQueryBuilder('product')
            .where('product.id IN (:...productId)', { productId: productIdList })
            .getMany();

        products.forEach(product => {
            const itemIndex = productIdList.indexOf(product.id);
            if (itemIndex !== -1) {
                const quantityToRemove = quantityList[itemIndex];
                if (cart.totalQuantity < quantityToRemove) {
                    throw new BadRequestException('상품을 제거할 수량이 없습니다');
                }

                cart.totalQuantity -= quantityToRemove; // 총 수량 - 선택 수량
                cart.totalAmount -= product.price * quantityToRemove;

                if (cart.totalQuantity <= 0) {
                    cart.isDeleted = true; // 장바구니의 총 수량이 0 이하라면 softDelete
                }
            }
        });

        return this.cartsRepository.save(cart);
    }

    async softDeleteCart(userId: number, cartInfoDTO: CartInfoDTO): Promise<void> {
        const { cartId } = cartInfoDTO;

        const user = await this.usersRepository.findOne({ where: { id: userId } });

        const cart = await this.cartsRepository.findOne({
            where: { id: cartId },
            relations: ['user'],
        });

        if (!cart) {
            throw new NotFoundException('장바구니 정보를 찾을 수 없습니다');
        }
        if (cart.user?.id !== user.id && user.role !== 'ADMIN') {
            throw new UnauthorizedException('해당 사용자의 장바구니 or ADMIN 권한이 아니므로 삭제할 수 없습니다');
        }

        await this.cartsRepository.update({ id: cartId }, { isDeleted: true });
    }
}
