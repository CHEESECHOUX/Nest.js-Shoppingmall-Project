import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '@src/users/users.service';
import { CreateUserDTO } from '@src/users/dto/users.dto';
import { User } from '@src/users/user.entity';

@Controller('/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/signup')
    async signup(@Body() createUserDTO: CreateUserDTO): Promise<User> {
        return this.usersService.signUp(createUserDTO);
    }
}
