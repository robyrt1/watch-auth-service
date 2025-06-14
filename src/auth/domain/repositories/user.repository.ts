import { User } from '../entities/user.entity';
import { Email } from '../value-objects/email.vo';

export interface IUserRepository {
    save(user: User): Promise<User>;
    findByEmail(email: Email): Promise<User | null>;
    findById(id: string): Promise<User | null>;
}

export const USER_REPOSITORY_TOKEN = 'IUserRepository';