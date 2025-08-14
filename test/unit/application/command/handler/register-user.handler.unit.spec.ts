
import { faker } from '@faker-js/faker';
import { RegisterUserHandler } from 'src/auth/application/commands/handlers/register-user.handler';
import { RegisterUserCommand } from 'src/auth/application/commands/impl/register-user.command';
import { User } from 'src/auth/domain/entities/user.entity';
import { UserRegisteredEvent } from 'src/auth/domain/events/user-registered.event';
import { UserAlreadyExistsException } from 'src/auth/domain/exceptions/user-already-exists.exception';
import { Email } from 'src/auth/domain/value-objects/email.vo';
import { Password } from 'src/auth/domain/value-objects/password.vo';

const mockUserRepository = {
    findByEmail: jest.fn(),
    save: jest.fn(),
};

const mockPasswordHasherService = {
    hash: jest.fn(),
};

const mockJwtTokenService = {
    generateAccessToken: jest.fn(),
};

const mockAuthEventPublisher = {
    publishUserRegisteredEvent: jest.fn(),
};

describe('Feature: User Registration', () => {
    let sut: RegisterUserHandler;

    beforeAll(() => {
        sut = new RegisterUserHandler(
            mockUserRepository as any,
            mockPasswordHasherService as any,
            mockJwtTokenService as any,
            mockAuthEventPublisher as any,
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Scenario: New user successfully registers', () => {
        let command: RegisterUserCommand;
        let user: User;
        let accessToken: string;
        let result: any;

        beforeEach(async () => {
            const passwordHash = faker.internet.password({ length: 10 });
            command = new RegisterUserCommand(
                faker.internet.email(),
                faker.internet.password(),
                faker.internet.username(),
            );
            user = User.create(new Email(command.email), new Password(passwordHash), command.username);
            accessToken = faker.string.uuid();

            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockPasswordHasherService.hash.mockResolvedValue(passwordHash);
            mockUserRepository.save.mockResolvedValue(user);
            mockJwtTokenService.generateAccessToken.mockResolvedValue(accessToken);
            mockAuthEventPublisher.publishUserRegisteredEvent.mockResolvedValue(undefined);

            result = await sut.execute(command);
        });

        it('Then: an auth response is returned', () => {
            expect(result).toEqual({
                accessToken: accessToken,
                userId: user.getId(),
                email: user.getEmail().getValue(),
            });
        });


        it('And: password is hashed', () => {
            expect(mockPasswordHasherService.hash).toHaveBeenCalled();
            expect(mockPasswordHasherService.hash).toHaveBeenCalledWith(command.password);
        });

        it('And: the new user is saved', () => {
            expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(User));
        });

        it('And: an access token is generated', () => {
            expect(mockJwtTokenService.generateAccessToken).toHaveBeenCalledWith(user.getId(), user.getEmail().getValue());
        });

        it('And: a UserRegisteredEvent is published', () => {
            expect(mockAuthEventPublisher.publishUserRegisteredEvent).toHaveBeenCalledWith(expect.any(UserRegisteredEvent));
        });
    });

    describe('Scenario: User registration fails due to existing email', () => {
        let command: RegisterUserCommand;
        let error: any;

        beforeEach(async () => {
            command = new RegisterUserCommand(
                faker.internet.email(),
                faker.internet.password(),
                faker.internet.username(),
            );
            const existingUser = User.create(new Email(command.email), new Password(faker.internet.password({ length: 10 })));

            mockUserRepository.findByEmail.mockResolvedValue(existingUser);

            try {
                await sut.execute(command);
            } catch (e) {
                error = e;
            }
        });

        it('Then: a UserAlreadyExistsException is thrown', () => {
            expect(error).toBeInstanceOf(UserAlreadyExistsException);
        });

        it('And: findByEmail is called with the correct email', () => {
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(expect.any(Email));
        });

        it('And: the password is not hashed', () => {
            expect(mockPasswordHasherService.hash).not.toHaveBeenCalled();
        });

        it('And: the user is not saved', () => {
            expect(mockUserRepository.save).not.toHaveBeenCalled();
        });
    });
});
