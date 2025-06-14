import { BadRequestException } from '@nestjs/common';

export class Password {
    private readonly value: string; // Armazena o hash da senha

    constructor(hashedPassword: string) {
        if (!hashedPassword || hashedPassword.length < 6) { // Exemplo de validação mínima
            throw new BadRequestException('Invalid password hash provided');
        }
        this.value = hashedPassword;
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: Password): boolean {
        return this.value === other.value;
    }
}