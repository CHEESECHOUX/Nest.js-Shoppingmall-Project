import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { TossPaymentDTO } from '@src/payments/dto/payment.dto';

@Injectable()
export class PaymentsService {
    private readonly tossUrl = 'https://api.tosspayments.com/v1/payments/';
    private readonly secretKey = process.env.TOSS_TEST_SECRET_KEY;

    async tossPayment(tossPaymentDTO: TossPaymentDTO) {
        const { orderId, amount, paymentKey } = tossPaymentDTO;

        try {
            const response = await axios.post(
                `${this.tossUrl}/${paymentKey}`,
                {
                    orderId,
                    amount,
                },
                {
                    headers: {
                        Authorization: `Basic ${Buffer.from(`${this.secretKey}:`).toString('base64')}`,
                        'Content-Type': 'application/json',
                    },
                },
            );
            return {
                title: '결제 성공',
                body: response.data,
                // amount: response.data.totalAmount,
            };
        } catch (e) {
            console.log('토스 페이먼츠 에러 코드', e);
        }
    }
}
