import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import { UserRegisteredEvent } from '../../../../src/auth/domain/events/user-registered.event';
import { AuthEventPublisher } from '../../../../src/auth/infrastructure/messaging/auth.event-publisher';
import { RABBITMQ_SERVICE } from '../../../../src/auth/infrastructure/messaging/rabbitmq/rabbitmq.client';

const mockClientProxy = {
    emit: jest.fn(),
};

describe('Feature: Event Publishing', () => {
    let sut: AuthEventPublisher;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthEventPublisher,
                {
                    provide: RABBITMQ_SERVICE,
                    useValue: mockClientProxy,
                },
            ],
        }).compile();

        sut = module.get<AuthEventPublisher>(AuthEventPublisher);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Scenario: A UserRegisteredEvent is published', () => {

        it('GIVEN: um UserRegisteredEvent com dados válidos, WHEN: publishUserRegisteredEvent is called, THEN: o client.emit é chamado com o nome e payload corretos', async () => {
            const payload = {
                userId: faker.string.uuid(),
                email: faker.internet.email(),
                username: faker.internet.username(),
                timestamp: new Date(),
            };
            const event = new UserRegisteredEvent(payload);

            await sut.publishUserRegisteredEvent(event);

            expect(mockClientProxy.emit).toHaveBeenCalledWith(event.name, event.payload);
        });
    });
});
