import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { User } from 'src/auth/domain/entities/user.entity';
import { AuthGuard } from 'src/auth/infrastructure/http/guards/auth.guard';
import { RegisterUserCommand } from '../../application/commands/impl/register-user.command';
import { LoginUserQuery } from '../../application/queries/impl/login-user.query';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { LoginUserRequestDto } from './dtos/login-user.request.dto';
import { RegisterUserRequestDto } from './dtos/register-user.request.dto';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @UseGuards(AuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async me(@Req() req: RequestWithUser): Promise<User> {
    return req.user;
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterUserRequestDto,
  ): Promise<AuthResponseDto> {
    const result = await this.commandBus.execute(
      new RegisterUserCommand(dto.email, dto.password, dto.username),
    );
    return result;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginUserRequestDto): Promise<AuthResponseDto> {
    const result = await this.queryBus.execute(
      new LoginUserQuery(dto.email, dto.password),
    );
    return result;
  }

}