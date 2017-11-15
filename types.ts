export interface AboutMessage {
    type: 'about';
    data: {
        type: 'device' | 'client';
        userAgent: string;
    };
}

export interface StartTestMessage {
    type: 'startTest';
    data: {
        url: string;
    };
}

export type Message
    = AboutMessage
    | StartTestMessage;

export type MessageType = Message['type'];
