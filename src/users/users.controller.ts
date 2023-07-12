import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from '@src/users/users.service';
import { CreateUserDTO, LogInDTO, LogInResponseDTO, UsersInfoDTO } from '@src/users/dto/users.dto';
import { User } from '@src/users/user.entity';
import { JwtAuthGuard } from '@src/users/jwt/jwt.guard';
import { RolesGuard } from '@src/guards/roles.guard';
import { AuthUser, AuthUserType } from '@src/common/decorators/users.decorator';

@Controller('/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('/myinfo')
    @UseGuards(JwtAuthGuard, RolesGuard)
    // @SetMetadata('roles', ['CUSTOMER'])
    async getUserInfo(@AuthUser('id') authUserType: AuthUserType): Promise<UsersInfoDTO | null> {
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

    @Post(':id/withdrawal')
    @UseGuards(JwtAuthGuard, RolesGuard)
    async withdrawal(@Param('id') userId: number): Promise<void> {
        return this.usersService.softDeleteUser(userId);
    }
}
