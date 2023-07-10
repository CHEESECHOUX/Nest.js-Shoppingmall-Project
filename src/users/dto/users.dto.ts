import { IsEmail, IsString } from 'class-validator';

export class LogInDTO {
    @IsString()
    loginId: string;

    @IsString()
    password: string;
}

export class CreateUserDTO extends LogInDTO {
    @IsString()
    name: string;

    @IsString()
    phone: string;

    @IsEmail()
    email: string;

    @IsString()
    zipcode: string;

    @IsString()
    address: string;
}
