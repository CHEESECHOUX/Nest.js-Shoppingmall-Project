import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from '@src/orders/entity/order.entity';
import { Payment, PaymentStatusEnum } from '@src/payments/entity/payment.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateOrderDTO, OrderInfoDTO } from '@src/orders/dto/orders.dto';
import { PaymentsService } from '@src/payments/payments.service';
import { CancelTossPaymentDTO, CreateTossPaymentDTO } from '@src/payments/dto/payment.dto';
import { UpdateOrderDTO } from '@src/orders/dto/orders.dto';
import { PaymentCancel } from '@src/payments/entity/payment-cancel.entity';
import { User } from '@src/users/entity/user.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        @InjectRepository(Payment)
        private paymentsRepository: Repository<Payment>,
        private paymentsService: PaymentsService,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async getOrderById(id: number): Promise<OrderInfoDTO | null> {
        const orderInfo = await this.ordersRepository.findOne({ where: { id } });
        if (!orderInfo) {
            throw new UnauthorizedException('주문 내역을 찾을 수 없습니다');
        }

        return orderInfo;
    }

    async createOrder(user: User, createOrderDTO: CreateOrderDTO): Promise<any> {
        const { addressee, address, zipcode, phone, requirement, totalAmount, status, method, paymentKey, orderId, amount } = createOrderDTO;

        // 주문 생성
        const order = new Order();
        order.user = user;
        order.addressee = addressee;
        order.address = address;
        order.zipcode = zipcode;
        order.phone = phone;
        order.requirement = requirement;
        order.totalAmount = totalAmount; // 장바구니랑 연결할 때 계산
        order.status = status as OrderStatus;
        order.tossOrderId = orderId;
        order.tossPaymentKey = paymentKey;

        // 트랜잭션 시작
        return this.ordersRepository.manager.transaction(async (transactionalEntityManager: EntityManager) => {
            try {
                // 주문 저장
                const savedOrder = await transactionalEntityManager.save(order);

                // toss 결제
                const createTossPaymentDTO: CreateTossPaymentDTO = {
                    paymentKey: paymentKey,
                    orderId: orderId,
                    amount: amount, // 장바구니 총 주문금액이랑 같아야함
                };
                await this.paymentsService.tossPaymentKey(createTossPaymentDTO);

                // 결제 저장
                const payment = new Payment();
                payment.method = method;
                payment.amount = createTossPaymentDTO.amount;
                payment.status = PaymentStatusEnum.COMPLETED;
                payment.order = savedOrder;

                await transactionalEntityManager.save(payment);

                // 주문 업데이트
                savedOrder.tossPaymentKey = createTossPaymentDTO.paymentKey;
                savedOrder.tossOrderId = createTossPaymentDTO.orderId;

                // 업데이트된 주문 저장
                await transactionalEntityManager.save(savedOrder);

                return savedOrder;
            } catch (e) {
                console.error('토스 결제 처리 중 에러:', e);
                throw new Error('주문 및 결제 처리 중 에러가 발생했습니다');
            }
        });
    }

    async updateOrderAddress(user: User, orderId: number, updateOrderDTO: UpdateOrderDTO): Promise<Order> {
        const { address } = updateOrderDTO;

        const order = await this.ordersRepository.findOne({
            where: { id: orderId },
            relations: ['user'],
        });
        if (!order) {
            throw new NotFoundException('주문 내역을 찾을 수 없습니다');
        }
        if (order.user.id !== user.id) {
            throw new UnauthorizedException('사용자의 주문 내역이 아닙니다');
        }

        order.address = address;
        const updatedOrder = await this.ordersRepository.save(order);

        return updatedOrder;
    }

    async cancelOrder(cancelTossPaymentDTO: CancelTossPaymentDTO): Promise<Order> {
        const { paymentKey, orderId, method, cancelReason, cancelAmount, bank, accountNumber, holderName, refundableAmount } = cancelTossPaymentDTO;

        return this.ordersRepository.manager.transaction(async (transactionalEntityManager: EntityManager) => {
            try {
                // 주문 조회
                const order = await transactionalEntityManager.findOne(Order, { where: { tossOrderId: orderId } });
                if (!order) {
                    throw new Error('주문 내역을 찾을 수 없습니다');
                }

                // 주문 상태 취소로 변경
                order.status = 'CANCELED';

                // toss 결제 취소
                await this.paymentsService.cancelTossPayment(cancelTossPaymentDTO);

                // 결제 테이블 취소 처리
                const payment = new Payment();
                payment.method = method;
                payment.amount = cancelAmount;
                payment.status = PaymentStatusEnum.CANCELED;

                await transactionalEntityManager.save(payment);

                // 결제 취소 테이블 취소 처리
                const paymentCancel = new PaymentCancel();
                paymentCancel.tossOrderId = order.tossOrderId;
                paymentCancel.cancelReason = cancelReason;
                paymentCancel.cancelAmount = cancelAmount;
                paymentCancel.bank = bank;
                paymentCancel.accountNumber = accountNumber;
                paymentCancel.holderName = holderName;
                paymentCancel.refundableAmount = refundableAmount;
                paymentCancel.cancelTime = new Date();

                await transactionalEntityManager.save(paymentCancel);

                // 토스 페이먼츠 키, 주문 ID 초기화
                order.tossPaymentKey = '';
                order.tossOrderId = '';

                // 주문 취소 정보 저장
                await transactionalEntityManager.save(order);

                return order;
            } catch (e) {
                console.error('주문 및 결제 취소 처리 중 에러:', e);
                throw new Error('주문 및 결제 취소 처리 중 에러가 발생했습니다');
            }
        });
    }
}
