import { faker } from '@faker-js/faker/.';
import { BadRequestException } from '@nestjs/common';
import { Email } from '../../../../src/auth/domain/value-objects/email.vo';


const EmailMock = faker.internet.email();
describe('Email Value Object', () => {
    it('should create a valid email successfully', () => {
        const email = new Email(EmailMock);
        expect(email.getValue()).toBe(EmailMock);
    });

    it('should throw BadRequestException for an invalid email format', () => {
        expect(() => new Email('invalid-email')).toThrow(BadRequestException);
        expect(() => new Email('invalid@')).toThrow(BadRequestException);
        expect(() => new Email('@example.com')).toThrow(BadRequestException);
    });

    it('should correctly compare two equal emails', () => {
        const email1 = new Email(EmailMock);
        const email2 = new Email(EmailMock);
        expect(email1.equals(email2)).toBe(true);
    });

    it('should correctly compare two different emails', () => {
        const email1 = new Email(faker.internet.email());
        const email2 = new Email(faker.internet.email());
        expect(email1.equals(email2)).toBe(false);
    });
});