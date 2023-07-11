import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '@src/users/users.service';
import { CreateUserDTO, LogInDTO, LogInResponseDTO } from '@src/users/dto/users.dto';
import { User } from '@src/users/user.entity';

@Controller('/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/signup')
    async signup(@Body() createUserDTO: CreateUserDTO): Promise<User> {
        return this.usersService.signUp(createUserDTO);
    }

    @Post('/login')
    async login(@Body() logInDTO: LogInDTO): Promise<LogInResponseDTO> {
        return this.usersService.login(logInDTO);
    }
}
