export interface UserRegisteredEventPayload {
    userId: string;
    email: string;
    username?: string;
    timestamp: Date;
}

export class UserRegisteredEvent {
    public readonly name = 'user.registered'; // Nome do evento para identificação
    constructor(public readonly payload: UserRegisteredEventPayload) { }
}