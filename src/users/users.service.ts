import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@src/users/user.entity';
import { CreateUserDTO } from './dto/users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

    async signUp(createUserDTO: CreateUserDTO): Promise<User> {
        const { loginId, password, name, phone, email, zipcode, address } = createUserDTO;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const existUser = await this.usersRepository.findOne({ where: { loginId } });
        if (existUser) {
            throw new ConflictException('이미 존재하는 이메일입니다');
        }

        const user = new User();
        user.loginId = loginId;
        user.password = hashedPassword;
        user.name = name;
        user.phone = phone;
        user.email = email;
        user.zipcode = zipcode;
        user.address = address;

        await this.usersRepository.save(user);

        return user;
    }
}
