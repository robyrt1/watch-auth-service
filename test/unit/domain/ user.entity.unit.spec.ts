import { faker } from '@faker-js/faker';
import { User } from '../../../src/auth/domain/entities/user.entity';
import { Email } from '../../../src/auth/domain/value-objects/email.vo';
import { Password } from '../../../src/auth/domain/value-objects/password.vo';

const idUuidMock = faker.string.uuid();
jest.mock('crypto', () => ({
    randomUUID: jest.fn(() => idUuidMock),
}));

describe('User Entity', () => {

    it('should be able to create a new user', () => {
        const emailString = faker.internet.email();
        const passwordString = faker.internet.password();
        const username = faker.internet.username();
        const email = new Email(emailString);
        const password = new Password(passwordString);

        const sut = User.create(email, password, username);

        expect(sut).toBeInstanceOf(User);
        expect(sut.getId()).toBe(idUuidMock);
        expect(sut.getEmail().getValue()).toBe(emailString);
        expect(sut.getUsername()).toBe(username);
        expect(sut.getCreatedAt()).toBeInstanceOf(Date);
    });

    it('should be able to change a user\'s password', () => {
        const oldPasswordString = faker.internet.password();
        const newPasswordString = faker.internet.password();

        const email = new Email(faker.internet.email());
        const oldPassword = new Password(oldPasswordString);

        const sut = User.create(email, oldPassword);
        const oldUpdatedAt = sut.getUpdatedAt();

        const newPassword = new Password(newPasswordString);

        sut.changePassword(newPassword);

        expect(sut.getPassword().getValue()).toBe(newPasswordString);
        expect(sut.getUpdatedAt()).not.toBe(oldUpdatedAt);
    });

    it('should be able to update a user\'s username', () => {
        const emailString = faker.internet.email();
        const passwordString = faker.internet.password();
        const email = new Email(emailString);
        const password = new Password(passwordString);
        const sut = User.create(email, password, 'old_username');
        const oldUpdatedAt = sut.getUpdatedAt();

        sut.updateUsername('new_username');

        expect(sut.getUsername()).toBe('new_username');
        expect(sut.getUpdatedAt()).not.toBe(oldUpdatedAt);
    });
});