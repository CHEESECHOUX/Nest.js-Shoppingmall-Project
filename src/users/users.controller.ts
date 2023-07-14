import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Request, UseGuards } from '@nestjs/common';
import { UsersService } from '@src/users/users.service';
import { CreateUserDTO, LogInDTO, LogInResponseDTO, UserInfoDTO } from '@src/users/dto/users.dto';
import { User } from '@src/users/entity/user.entity';
import { JwtAuthGuard } from '@src/users/jwt/jwt.guard';
import { RolesGuard } from '@src/guards/roles.guard';
import { AuthUser, AuthUserType } from '@src/common/decorators/users.decorator';

@Controller('/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('/myinfo')
    @UseGuards(JwtAuthGuard, RolesGuard)
    // @SetMetadata('roles', ['CUSTOMER'])
    async getUserInfo(@AuthUser() authUserType: AuthUserType): Promise<UserInfoDTO | null> {
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

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    async updateUser(@Param('id') id: number, @Body() createUserDTO: CreateUserDTO): Promise<User> {
        return this.usersService.updateUser(id, createUserDTO);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async softDeleteParam(@Param('id') id: number): Promise<void> {
        return this.usersService.softDeleteParamId(id);
    }

    @Delete('')
    @UseGuards(JwtAuthGuard)
    async softDeletePayload(@Request() req) {
        return this.usersService.softDeletePayloadId(req.user);
    }
}
