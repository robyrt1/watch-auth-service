import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import { Email } from '../../../domain/value-objects/email.vo';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
    constructor(
        @InjectRepository(UserOrmEntity)
        private readonly ormRepository: Repository<UserOrmEntity>,
    ) { }

    async save(user: User): Promise<User> {
        const ormEntity = UserMapper.toOrmEntity(user);
        const savedOrmEntity = await this.ormRepository.save(ormEntity);
        return UserMapper.toDomainEntity(savedOrmEntity);
    }

    async findByEmail(email: Email): Promise<User | null> {
        const ormEntity = await this.ormRepository.findOne({ where: { email: email.getValue() } });
        return ormEntity ? UserMapper.toDomainEntity(ormEntity) : null;
    }

    async findById(id: string): Promise<User | null> {
        const ormEntity = await this.ormRepository.findOne({ where: { id } });
        return ormEntity ? UserMapper.toDomainEntity(ormEntity) : null;
    }
}