import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '@src/users/users.service';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { CacheService } from '@src/cache/cache.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly usersService: UsersService,
        private readonly redisService: RedisService,
        private readonly cacheService: CacheService,
    ) {
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
        const cachedUser = await this.cacheService.get(`user:${id}`);
        if (cachedUser) {
            console.log('캐시에서 사용자 정보를 가져왔습니다');
            return cachedUser;
        }

        // 캐시에 없는 경우, 데이터베이스에서 사용자 정보를 가져옴
        const user = await this.usersService.getUserInfo({ id });
        if (!user) {
            throw new UnauthorizedException('사용자를 찾을 수 없습니다');
        }

        await this.cacheService.set(`user:${id}`, JSON.stringify(user), 3600); // 캐시 만료 시간 : 1시간

        return user;
    }
}
