import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from '@src/users/users.service';
import { CreateUserDTO, LogInDTO, LogInResponseDTO, UserInfoDTO } from '@src/users/dto/users.dto';
import { User } from '@src/users/entity/user.entity';
import { JwtAuthGuard } from '@src/users/jwt/jwt.guard';
import { GetUserJWT, AuthUserType } from '@src/common/decorators/get-user-jwt.decorator';
import { GetUserRequest } from '@src/common/decorators/get-user-request.decorator';

@Controller('/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('/myinfo')
    @UseGuards(JwtAuthGuard)
    async getUserInfo(@GetUserRequest() authUserType: AuthUserType): Promise<UserInfoDTO | null> {
        const userInfo = await this.usersService.getUserInfo(authUserType);
        return userInfo;
    }

    @Post('/signup')
    async signup(@Body() createUserDTO: CreateUserDTO): Promise<User> {
        return this.usersService.signUp(createUserDTO);
    }

    @Post('/login')
    async login(@Body() logInDTO: LogInDTO): Promise<LogInResponseDTO> {
        return this.usersService.login(logInDTO);
    }

    @Patch(':userId')
    @UseGuards(JwtAuthGuard)
    async updateUser(@Param('id') userId: number, @Body() createUserDTO: CreateUserDTO): Promise<User> {
        return this.usersService.updateUser(userId, createUserDTO);
    }

    @Delete(':userId')
    @UseGuards(JwtAuthGuard)
    async softDeleteParam(@Param('id') userId: number): Promise<void> {
        return this.usersService.softDeleteParamId(userId);
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    async softDeletePayload(@Request() req) {
        return this.usersService.softDeletePayloadId(req.user);
    }
}
