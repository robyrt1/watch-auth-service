import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PasswordHasherService } from '../../../../src/auth/infrastructure/security/password-hasher.service';

describe('Feature: Password Hashing and Comparison', () => {
    let sut: PasswordHasherService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PasswordHasherService],
        }).compile();

        sut = module.get<PasswordHasherService>(PasswordHasherService);
    });

    describe('Scenario: A password is successfully hashed and compared', () => {
        let password: string;
        let hashedPassword: string;

        beforeAll(async () => {
            password = faker.internet.password({ length: 10 });

            hashedPassword = await sut.hash(password);
        });

        it('Then: the password hash is a string', () => {
            expect(hashedPassword).toBeDefined();
            expect(typeof hashedPassword).toBe('string');
        });

        it('And: comparing the original password with the hash returns true', async () => {
            const isMatch = await sut.compare(password, hashedPassword);
            expect(isMatch).toBe(true);
        });

        it('And: comparing a wrong password with the hash returns false', async () => {
            const wrongPassword = faker.internet.password({ length: 10 });
            const isMatch = await sut.compare(wrongPassword, hashedPassword);
            expect(isMatch).toBe(false);
        });
    });
});
