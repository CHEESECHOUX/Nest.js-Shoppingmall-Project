import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '@src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly cachedUsers: Map<number, any> = new Map();

    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        if (!payload) {
            throw new UnauthorizedException('유효한 사용자 정보를 payload에서 찾을 수 없습니다');
        }

        const { id } = payload;

        // 캐시에 있는 경우, 캐시된 사용자 정보를 반환
        const cachedUser = this.cachedUsers.get(id);
        if (cachedUser) {
            return cachedUser;
        }

        // 캐시에 없는 경우, 데이터베이스에서 사용자 정보를 가져옴
        const user = await this.usersService.getUserInfo({ id });
        if (!user) {
            throw new UnauthorizedException('사용자를 찾을 수 없습니다');
        }

        // 나중에 사용할 수 있도록 캐시에 사용자 정보 저장
        this.cachedUsers.set(id, user);

        return user;
    }
}
