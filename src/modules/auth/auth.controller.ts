import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginGoogleRequestDto, LoginResDto } from './dto';
import { LoginGoogleCommand } from './commands';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login with google',
    type: LoginResDto,
  })
  async loginWithGoogle(@Body() data: LoginGoogleRequestDto): Promise<LoginResDto> {
    return this.commandBus.execute(new LoginGoogleCommand(data));
  }
}
