export interface AboutMessage {
    type: 'about';
    data: {
        type: 'device' | 'client';
        userAgent: string;
    };
}

export type Message = AboutMessage;
export type MessageType = Message['type'];
