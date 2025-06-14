import { Inject, UnauthorizedException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '../../../domain/repositories/user.repository';
import { Email } from '../../../domain/value-objects/email.vo';
import { JwtTokenService } from '../../../infrastructure/security/jwt/jwt.service';
import { PasswordHasherService } from '../../../infrastructure/security/password-hasher.service';
import { AuthResponseAppDto } from '../../dtos/auth.app-dto';
import { LoginUserQuery } from '../impl/login-user.query';

@QueryHandler(LoginUserQuery)
export class LoginUserHandler implements IQueryHandler<LoginUserQuery> {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: IUserRepository,
        private readonly passwordHasherService: PasswordHasherService,
        private readonly jwtTokenService: JwtTokenService,
    ) { }

    async execute(query: LoginUserQuery): Promise<AuthResponseAppDto> {
        const emailVo = new Email(query.email);

        const user = await this.userRepository.findByEmail(emailVo);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await this.passwordHasherService.compare(
            query.password,
            user.getPassword().getValue(),
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const accessToken = await this.jwtTokenService.generateAccessToken(
            user.getId(),
            user.getEmail().getValue(),
        );

        return {
            accessToken,
            userId: user.getId(),
            email: user.getEmail().getValue(),
        };
    }
}