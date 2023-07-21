import { post } from 'axios';

// 주문 생성에 필요한 데이터
const createOrderData = {
    addressee: '최지수',
    address: '서울시',
    zipcode: '12345',
    phone: '010-1234-1234',
    requirement: '부재시 문 앞에 두고가세요',
    totalAmount: 300,
    status: 'prepare',
    method: '핸드폰',
    paymentKey: 'OR1ZwdkQD5GePWvyJnrKJpkdgkzdE1VgLzN97EoqYA60XKx4',
    orderId: '4TITFDV0Qqs0xzmtqqtjS1',
    amount: 300,
};

// 주문 생성 요청
post('http://localhost:3000/orders', createOrderData)
    .then(response => {
        const order = response.data;
        // 주문 생성이 성공한 후에 결제 처리 요청
        const tossPaymentData = {
            paymentKey: order.paymentKey,
            orderId: order.orderId,
            amount: order.totalAmount,
        };
        return post('http://localhost:3000/payments/toss', tossPaymentData);
    })
    .then(response => {
        // 결제 처리 결과
        console.log(response.data);
    })
    .catch(error => {
        // 에러 처리
        console.error('Error:', error.message);
    });
