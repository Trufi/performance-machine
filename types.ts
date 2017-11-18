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

export interface TestResultsMessage {
    type: 'testResults';
    data: {
        samples: Array<{
            mean: number;
            deviation: number;
        }>;
    };
}

export interface UnxpectedTestClosingMessage {
    type: 'unexpectedTestClosing';
}

export type Message
    = AboutMessage
    | TestResultsMessage
    | UnxpectedTestClosingMessage
    | StartTestMessage;

export type MessageType = Message['type'];
