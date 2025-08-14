import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { Password } from '../../../../src/auth/domain/value-objects/password.vo';

describe('Password Value Object', () => {

    it('should be able to create a new Password instance', () => {
        const hashedPassword = faker.internet.password({ length: 10 });

        const sut = new Password(hashedPassword);

        expect(sut).toBeInstanceOf(Password);
        expect(sut.getValue()).toBe(hashedPassword);
    });

    it('should throw BadRequestException for a password hash with less than 6 characters', () => {
        const invalidPasswordHash = faker.internet.password({ length: 5 });

        const createSut = () => new Password(invalidPasswordHash);

        expect(createSut).toThrow(BadRequestException);
        expect(createSut).toThrow('Invalid password hash provided');
    });

    it('should return true when comparing two identical Password instances', () => {
        const hashedPassword = faker.internet.password();

        const sut1 = new Password(hashedPassword);
        const sut2 = new Password(hashedPassword);

        expect(sut1.equals(sut2)).toBe(true);
    });

    it('should return false when comparing two different Password instances', () => {
        const hashedPassword1 = faker.internet.password();
        const hashedPassword2 = faker.internet.password();

        const sut1 = new Password(hashedPassword1);
        const sut2 = new Password(hashedPassword2);

        expect(sut1.equals(sut2)).toBe(false);
    });
});