import { User } from '../../../domain/entities/user.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { Password } from '../../../domain/value-objects/password.vo';
import { UserOrmEntity } from '../entities/user.orm-entity';

export class UserMapper {
    public static toOrmEntity(domainUser: User): UserOrmEntity {
        const ormEntity = new UserOrmEntity();
        ormEntity.id = domainUser.getId();
        ormEntity.email = domainUser.getEmail().getValue();
        ormEntity.password = domainUser.getPassword().getValue();
        ormEntity.username = domainUser.getUsername();
        ormEntity.createdAt = domainUser.getCreatedAt();
        ormEntity.updatedAt = domainUser.getUpdatedAt();
        return ormEntity;
    }

    // Converte uma entidade ORM para uma entidade de domínio
    public static toDomainEntity(ormUser: UserOrmEntity): User {
        return User.from(
            ormUser.id,
            new Email(ormUser.email),
            new Password(ormUser.password),
            ormUser.username,
            ormUser.createdAt,
            ormUser.updatedAt,
        );
    }
}