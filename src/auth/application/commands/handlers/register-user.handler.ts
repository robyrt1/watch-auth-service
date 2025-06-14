import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRegisteredEvent } from 'src/auth/domain/events/user-registered.event';
import { AuthEventPublisher } from 'src/auth/infrastructure/messaging/auth.event-publisher';
import { User } from '../../../domain/entities/user.entity';
import { UserAlreadyExistsException } from '../../../domain/exceptions/user-already-exists.exception';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '../../../domain/repositories/user.repository';
import { Email } from '../../../domain/value-objects/email.vo';
import { Password } from '../../../domain/value-objects/password.vo';
import { JwtTokenService } from '../../../infrastructure/security/jwt/jwt.service';
import { PasswordHasherService } from '../../../infrastructure/security/password-hasher.service';
import { AuthResponseAppDto } from '../../dtos/auth.app-dto';
import { RegisterUserCommand } from '../impl/register-user.command';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: IUserRepository,
        private readonly passwordHasherService: PasswordHasherService,
        private readonly jwtTokenService: JwtTokenService,
        private readonly authEventPublisher: AuthEventPublisher,
    ) { }

    async execute(command: RegisterUserCommand): Promise<AuthResponseAppDto> {
        const emailVo = new Email(command.email);

        const existingUser = await this.userRepository.findByEmail(emailVo);
        if (existingUser) {
            throw new UserAlreadyExistsException(command.email);
        }

        const hashedPassword = await this.passwordHasherService.hash(command.password);
        const passwordVo = new Password(hashedPassword);

        const newUser = User.create(emailVo, passwordVo, command.username);
        const savedUser = await this.userRepository.save(newUser);

        const accessToken = await this.jwtTokenService.generateAccessToken(
            savedUser.getId(),
            savedUser.getEmail().getValue(),
        );

        const userRegisteredEvent = new UserRegisteredEvent({
            userId: savedUser.getId(),
            email: savedUser.getEmail().getValue(),
            username: savedUser.getUsername(),
            timestamp: savedUser.getCreatedAt(),
        });

        await this.authEventPublisher.publishUserRegisteredEvent(userRegisteredEvent);

        return {
            accessToken,
            userId: savedUser.getId(),
            email: savedUser.getEmail().getValue(),
        };
    }
}