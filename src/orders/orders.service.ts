import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from '@src/orders/entity/order.entity';
import { Payment, PaymentStatus } from '@src/payments/entity/payment.entity';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from '@src/orders/dto/orders.dto';
import { PaymentsService } from '@src/payments/payments.service';
import { TossPaymentDTO } from '@src/payments/dto/payment.dto';

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

        // 주문 저장
        const savedOrder = await this.ordersRepository.save(order);

        try {
            // toss 결제 처리
            const tossPaymentDTO: TossPaymentDTO = {
                paymentKey: paymentKey,
                orderId: orderId,
                amount: amount, // 장바구니 총 주문금액이랑 같아야함
            };
            await this.paymentsService.tossPayment(tossPaymentDTO);

            // 결제 저장
            const payment = new Payment();
            payment.method = method;
            payment.amount = tossPaymentDTO.amount;
            payment.status = PaymentStatus.COMPLETED;

            await this.paymentsRepository.save(payment);

            // 주문 업데이트
            savedOrder.paymentKey = tossPaymentDTO.paymentKey;
            savedOrder.orderId = tossPaymentDTO.orderId;

            // 업데이트된 주문 저장
            await this.ordersRepository.save(savedOrder);

            return savedOrder;
        } catch (e) {
            console.error('토스 결제 처리 중 에러:', e);
            throw new Error('주문과 결제 처리 중 에러가 발생했습니다');
        }
    }
}
