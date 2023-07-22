import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from '@src/orders/entity/order.entity';
import { Payment, PaymentStatusEnum } from '@src/payments/entity/payment.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateOrderDTO } from '@src/orders/dto/orders.dto';
import { PaymentsService } from '@src/payments/payments.service';
import { CreateTossPaymentDTO } from '@src/payments/dto/payment.dto';
import { UpdateOrderDTO } from '@src/orders/dto/orders.dto';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        @InjectRepository(Payment)
        private paymentsRepository: Repository<Payment>,
        private paymentsService: PaymentsService,
    ) {}

    async createOrder(createOrderDTO: CreateOrderDTO): Promise<any> {
        const { addressee, address, zipcode, phone, requirement, totalAmount, status, method, paymentKey, orderId, amount } = createOrderDTO;

        // 주문 생성
        const order = new Order();
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

                // toss 결제 처리
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

    async updateOrderAddress(orderId: number, updateOrderDTO: UpdateOrderDTO): Promise<Order> {
        const { address } = updateOrderDTO;

        const order = await this.ordersRepository.findOne({ where: { id: orderId } });
        if (!order) {
            throw new NotFoundException('주문 내역을 찾을 수 없습니다');
        }

        order.address = address;
        const updatedOrder = await this.ordersRepository.save(order);

        return updatedOrder;
    }
}
