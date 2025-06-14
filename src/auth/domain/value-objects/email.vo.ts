import { BadRequestException } from '@nestjs/common'; // Use uma exceção mais específica de domínio se preferir

export class Email {
    private readonly value: string;

    constructor(email: string) {
        if (!Email.isValid(email)) {
            throw new BadRequestException('Invalid email format');
        }
        this.value = email;
    }

    public static isValid(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: Email): boolean {
        return this.value === other.value;
    }
}