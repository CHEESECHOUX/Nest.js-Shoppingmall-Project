import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { TossPaymentDTO } from './dto/payment.dto';

@Injectable()
export class PaymentsService {
    tossUrl = 'https://api.tosspayments.com/v1/payments/confirm';

    async tossPayment(tossPaymentDTO: TossPaymentDTO) {
        const { orderId, amount, paymentKey } = tossPaymentDTO;

        try {
            const payment = await axios.post(
                this.tossUrl + paymentKey,
                {
                    orderId: orderId,
                    amount: amount,
                },
                {
                    headers: {
                        Authorization: 'Basic ' + Buffer.from(process.env.TOSS_TEST_SECRET_KEY + ':').toString('base64'),
                        'Content-Type': 'application/json',
                    },
                },
            );
            console.log('payment', payment);
            return {
                title: '결제 성공',
                // amount: response.body.totalAmount,
            };
        } catch (e) {
            console.log('토스 페이먼츠 에러 코드', e);
        }
    }
}
