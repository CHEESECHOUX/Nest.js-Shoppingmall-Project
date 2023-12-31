import { CreateTossPaymentDTO } from '@src/payments/dto/payment.dto';
import { IsNumber, IsString } from 'class-validator';

export class OrderInfoDTO {
    @IsNumber()
    id: number;
}

export class CreateOrderDTO extends CreateTossPaymentDTO {
    @IsString()
    addressee: string;

    @IsString()
    address: string;

    @IsString()
    zipcode: string;

    @IsString()
    phone: string;

    @IsString()
    requirement: string;

    @IsString()
    method: string;
}

export class UpdateOrderDTO {
    @IsString()
    address: string;
}

export class CreateOrderItemDTO {
    @IsString()
    orderProductName: string;

    @IsNumber()
    totalPrice: number;

    @IsNumber()
    quantity: number;
}
