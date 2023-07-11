import { IsEmail, IsString, Length, Matches, MinLength } from 'class-validator';

export class LogInDTO {
    @IsString()
    loginId: string;

    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/) // 비밀번호에는 대문자, 소문자, 특수 문자가 하나 이상씩 포함
    password: string;
}

export class CreateUserDTO extends LogInDTO {
    @IsString()
    name: string;

    @IsString()
    @Matches(/^\d{3}-\d{3,4}-\d{4}$/) // ex) XXX-XXXX-XXXX
    phone: string;

    @IsEmail()
    @Matches(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/) // ex) example@example.com
    email: string;

    @IsString()
    @Length(5, 5)
    zipcode: string;

    @IsString()
    address: string;
}
