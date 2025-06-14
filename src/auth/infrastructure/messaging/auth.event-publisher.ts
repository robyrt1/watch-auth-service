import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserRegisteredEvent } from '../../domain/events/user-registered.event';
import { RABBITMQ_SERVICE } from './rabbitmq/rabbitmq.client';

@Injectable()
export class AuthEventPublisher {
    constructor(
        @Inject(RABBITMQ_SERVICE) private readonly client: ClientProxy,
    ) { }

    async publishUserRegisteredEvent(event: UserRegisteredEvent): Promise<void> {
        console.log(`[AuthEventPublisher] Publishing event: ${event.name} with payload:`, event.payload);
        this.client.emit<UserRegisteredEvent>(event.name, event.payload);
    }
}