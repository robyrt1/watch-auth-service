import { BadRequestException } from '@nestjs/common';
import { Email } from '../../value-objects/email.vo';

describe('Email Value Object', () => {
    it('should create a valid email successfully', () => {
        const email = new Email('valid@example.com');
        expect(email.getValue()).toBe('valid@example.com');
    });

    it('should throw BadRequestException for an invalid email format', () => {
        expect(() => new Email('invalid-email')).toThrow(BadRequestException);
        expect(() => new Email('invalid@')).toThrow(BadRequestException);
        expect(() => new Email('@example.com')).toThrow(BadRequestException);
    });

    it('should correctly compare two equal emails', () => {
        const email1 = new Email('test@example.com');
        const email2 = new Email('test@example.com');
        expect(email1.equals(email2)).toBe(true);
    });

    it('should correctly compare two different emails', () => {
        const email1 = new Email('test1@example.com');
        const email2 = new Email('test2@example.com');
        expect(email1.equals(email2)).toBe(false);
    });
});