import { ConflictException } from '@nestjs/common';
import { UserAlreadyExistsException } from '../../../../src/auth/domain/exceptions/user-already-exists.exception';

describe('UserAlreadyExistsException', () => {

    it('should extend ConflictException from @nestjs/common', () => {
        const sut = new UserAlreadyExistsException('test@example.com');

        expect(sut).toBeInstanceOf(ConflictException);
    });

    it('should have the correct error message', () => {
        const email = 'test@example.com';
        const expectedMessage = `User with email '${email}' already exists.`;
        const sut = new UserAlreadyExistsException(email);

        expect(sut.message).toBe(expectedMessage);
    });
});