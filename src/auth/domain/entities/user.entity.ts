import { randomUUID } from 'crypto';
import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password.vo';

export class User {
    private id: string;
    private email: Email;
    private password: Password;
    private username?: string;
    private createdAt: Date;
    private updatedAt: Date;

    private constructor(
        id: string,
        email: Email,
        password: Password,
        username?: string,
        createdAt?: Date,
        updatedAt?: Date,
    ) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.username = username;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }

    public static create(
        email: Email,
        password: Password,
        username?: string,
    ): User {
        return new User(randomUUID(), email, password, username);
    }

    public static from(
        id: string,
        email: Email,
        password: Password,
        username?: string,
        createdAt?: Date,
        updatedAt?: Date,
    ): User {
        return new User(id, email, password, username, createdAt, updatedAt);
    }

    public getId(): string {
        return this.id;
    }

    public getEmail(): Email {
        return this.email;
    }

    public getPassword(): Password {
        return this.password;
    }

    public getUsername(): string | undefined {
        return this.username;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getUpdatedAt(): Date {
        return this.updatedAt;
    }

    public changePassword(newPassword: Password): void {
        this.password = newPassword;
        this.updatedAt = new Date();
    }

    public updateUsername(newUsername: string): void {
        this.username = newUsername;
        this.updatedAt = new Date();
    }
}