import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@src/users/user.entity';
import { CreateUserDTO, LogInDTO, LogInResponseDTO } from '@src/users/dto/users.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>, private jwtService: JwtService) {}

    async signUp(createUserDTO: CreateUserDTO): Promise<User> {
        const { loginId, password, name, phone, email, zipcode, address } = createUserDTO;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const existingUser = await this.usersRepository.findOne({
            where: [{ loginId }, { phone }, { email }],
        });

        if (existingUser) {
            if (existingUser.loginId === loginId) {
                throw new ConflictException('이미 존재하는 로그인 아이디입니다');
            }
            if (existingUser.phone === phone) {
                throw new ConflictException('이미 존재하는 휴대폰 번호입니다');
            }
            if (existingUser.email === email) {
                throw new ConflictException('이미 존재하는 이메일입니다');
            }
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

    async login(logInDTO: LogInDTO): Promise<LogInResponseDTO> {
        const { loginId, password } = logInDTO;

        const user = await this.usersRepository.findOneBy({ loginId });
        if (!user) {
            throw new UnauthorizedException('해당 아이디를 찾을 수 없습니다');
        }
        if (user && !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('비밀번호를 다시 확인해주세요');
        }

        const payload = { loginId: user.loginId };
        const accessToken = await this.jwtService.signAsync(payload);

        return { accessToken };
    }
}
