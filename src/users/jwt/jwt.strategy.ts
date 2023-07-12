import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '@src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        console.log('Payload:', payload);
        if (!payload) {
            throw new UnauthorizedException('유효한 사용자 정보를 payload에서 찾을 수 없습니다');
        }

        const { id } = payload;
        const user = await this.usersService.getUserInfo({ id });
        if (!user) {
            throw new UnauthorizedException('사용자를 찾을 수 없습니다');
        }
        return user;
    }
}
