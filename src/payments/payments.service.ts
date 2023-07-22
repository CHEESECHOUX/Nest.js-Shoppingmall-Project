import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CreateTossPaymentDTO, CancelTossPaymentDTO } from '@src/payments/dto/payment.dto';

@Injectable()
export class PaymentsService {
    private readonly tossUrl = 'https://api.tosspayments.com/v1/payments/';
    private readonly secretKey = process.env.TOSS_TEST_SECRET_KEY;

    async tossPaymentKey(createTossPaymentDTO: CreateTossPaymentDTO) {
        const { orderId, amount, paymentKey } = createTossPaymentDTO;

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
            throw new Error('토스 페이먼츠 결제 요청 중 오류가 발생했습니다.');
        }
    }

    async cancelTossPayment(cancelTossPaymentDTO: CancelTossPaymentDTO) {
        const { paymentKey, cancelReason, cancelAmount, bank, accountNumber, holderName, refundableAmount } = cancelTossPaymentDTO;

        try {
            const response = await axios.post(
                `${this.tossUrl}/${paymentKey}/cancel`,
                {
                    cancelReason: cancelReason,
                    cancelAmount: cancelAmount,
                    refundReceiveAccount: {
                        bank: bank,
                        accountNumber: accountNumber,
                        holderName: holderName,
                    },
                    refundableAmount: refundableAmount,
                },
                {
                    headers: {
                        Authorization: `Basic ${Buffer.from(`${this.secretKey}:`).toString('base64')}`,
                        'Content-Type': 'application/json',
                    },
                },
            );
            return {
                title: '토스 페이먼츠 결제 취소에 성공했습니다',
                body: response.data,
            };
        } catch (e) {
            console.log('토스 페이먼츠 에러 코드', e);
            throw new Error('토스 페이먼츠 결제 취소 요청 중 오류가 발생했습니다.');
        }
    }
}
