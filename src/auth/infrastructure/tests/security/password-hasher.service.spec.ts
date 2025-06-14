import { PasswordHasherService } from '../../security/password-hasher.service';

describe('PasswordHasherService', () => {
    let service: PasswordHasherService;

    beforeEach(() => {
        service = new PasswordHasherService();
    });

    it('should hash a password', async () => {
        const password = 'mySecretPassword123';
        const hashedPassword = await service.hash(password);

        expect(typeof hashedPassword).toBe('string');
        expect(hashedPassword.length).toBeGreaterThan(0);
        expect(hashedPassword.startsWith('$2b$') || hashedPassword.startsWith('$2a$')).toBe(true);
    });

    it('should correctly compare a password with its hash', async () => {
        const password = 'mySecretPassword123';
        const hashedPassword = await service.hash(password);

        const isMatch = await service.compare(password, hashedPassword);
        expect(isMatch).toBe(true);
    });

    it('should return false for incorrect password comparison', async () => {
        const password = 'mySecretPassword123';
        const wrongPassword = 'wrongPassword';
        const hashedPassword = await service.hash(password);

        const isMatch = await service.compare(wrongPassword, hashedPassword);
        expect(isMatch).toBe(false);
    });
});