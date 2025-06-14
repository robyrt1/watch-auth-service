import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule } from '@nestjs/microservices'; // <--- IMPORTAR
import { TypeOrmModule } from '@nestjs/typeorm';


import { USER_REPOSITORY_TOKEN } from './domain/repositories/user.repository';

import { RegisterUserHandler } from './application/commands/handlers/register-user.handler';
import { LoginUserHandler } from './application/queries/handlers/login-user.handler';

import { UserOrmEntity } from './infrastructure/persistence/entities/user.orm-entity';
import { UserRepositoryImpl } from './infrastructure/persistence/repositories/user.repository.impl';
import { JwtTokenService } from './infrastructure/security/jwt/jwt.service';
import { JwtStrategy } from './infrastructure/security/jwt/jwt.strategy';
import { PasswordHasherService } from './infrastructure/security/password-hasher.service';

import { AuthEventPublisher } from './infrastructure/messaging/auth.event-publisher';
import { RABBITMQ_SERVICE, getRabbitMQClientOptions } from './infrastructure/messaging/rabbitmq/rabbitmq.client';


import { AuthGuard } from './infrastructure/http/guards/auth.guard';
import { AuthController } from './interfaces/http/auth.controller';

const commandHandlers = [RegisterUserHandler];
const queryHandlers = [LoginUserHandler];

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([UserOrmEntity]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1h' },
            }),
            inject: [ConfigService],
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ClientsModule.registerAsync([
            {
                name: RABBITMQ_SERVICE,
                imports: [ConfigModule],
                useFactory: (configService: ConfigService) => getRabbitMQClientOptions(configService),
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [AuthController],
    providers: [
        {
            provide: USER_REPOSITORY_TOKEN,
            useClass: UserRepositoryImpl,
        },
        PasswordHasherService,
        JwtTokenService,
        JwtStrategy,
        AuthEventPublisher,
        ...commandHandlers,
        ...queryHandlers,
        AuthGuard,
    ],
    exports: [
        JwtTokenService,
        { provide: USER_REPOSITORY_TOKEN, useClass: UserRepositoryImpl },
        AuthEventPublisher
    ],
})
export class AuthModule { }