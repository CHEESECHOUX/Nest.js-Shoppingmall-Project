import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@src/users/user.entity';
import { CreateUserDTO, LogInDTO, LogInResponseDTO, UsersInfoDTO } from '@src/users/dto/users.dto';
import { AuthUserType } from '@src/common/decorators/users.decorator';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>, private jwtService: JwtService) {}

    async getUserInfo({ id }: AuthUserType): Promise<UsersInfoDTO | null> {
        const userInfo = await this.usersRepository.findOne({ where: { id } });
        if (!userInfo) {
            throw new UnauthorizedException('사용자를 찾을 수 없습니다');
        }
        return userInfo;
    }

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

        const payload = { id: user.id };
        const accessToken = await this.jwtService.signAsync(payload);

        return { accessToken };
    }

    async updateUser(id: number, createUserDTO: CreateUserDTO): Promise<User> {
        const { loginId, password, name, phone, email, zipcode, address } = createUserDTO;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const existingUser = await this.usersRepository.findOne({ where: { id } });

        if (!existingUser) {
            throw new NotFoundException('사용자 정보를 찾을 수 없습니다');
        }

        existingUser.loginId = loginId;
        existingUser.password = hashedPassword;
        existingUser.name = name;
        existingUser.phone = phone;
        existingUser.email = email;
        existingUser.zipcode = zipcode;
        existingUser.address = address;

        await this.usersRepository.save(existingUser);

        return existingUser;
    }

    async softDeleteUser(id: number): Promise<void> {
        await this.usersRepository.update(id, { isDeleted: true });
    }
}
