// src/infrastructure/messaging/rabbitmq/rabbitmq.client.ts
import { ConfigService } from '@nestjs/config';
import { ClientOptions, Transport } from '@nestjs/microservices';

export const getRabbitMQClientOptions = (configService: ConfigService): ClientOptions => {
    const rabbitmqHost = configService.get<string>('RABBITMQ_HOST') || 'localhost';
    const rabbitmqPort = configService.get<number>('RABBITMQ_PORT') || 5672;
    const rabbitmqUser = configService.get<string>('RABBITMQ_USER') || 'guest';
    const rabbitmqPass = configService.get<string>('RABBITMQ_PASSWORD') || 'guest';
    const rabbitmqQueue = configService.get<string>('RABBITMQ_QUEUE') || 'auth_events_queue';

    return {
        transport: Transport.RMQ,
        options: {
            urls: [`amqp://${rabbitmqUser}:${rabbitmqPass}@${rabbitmqHost}:${rabbitmqPort}`],
            queue: rabbitmqQueue,
            queueOptions: {
                durable: true,
            },
        },
    };
};

export const RABBITMQ_SERVICE = 'RABBITMQ_SERVICE';