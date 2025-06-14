import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '../../../domain/repositories/user.repository'; // Importar a interface do repositório
import { Email } from '../../../domain/value-objects/email.vo'; // Importar Email Value Object

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: IUserRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(payload: any) {
        const userEmail = new Email(payload.email);
        const user = await this.userRepository.findByEmail(userEmail);

        if (!user) {
            throw new UnauthorizedException('User not found or invalid token');
        }

        return { userId: user.getId(), email: user.getEmail().getValue(), username: user.getUsername() };
    }
}