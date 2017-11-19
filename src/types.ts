import { TestsData } from './server/types';
export interface AboutMessage {
    type: 'about';
    data: {
        type: 'device' | 'viewer';
        userAgent: string;
    };
}

export interface StartTestMessage {
    type: 'startTest';
    data: {
        runId: number;
        url: string;
    };
}

export interface TestResultsMessage {
    type: 'testResults';
    data: {
        runId: number;
        name: string;
        description: string;
        samples: Array<{
            mean: number;
            deviation: number;
        }>;
    };
}

export interface UnxpectedTestClosingMessage {
    type: 'unexpectedTestClosing';
}

export interface AggregatorDeviceData {
    id: number;
    userAgent: string;
    runningTest?: {
        url: string;
        name?: string;
        startTime: number;
    };
}

export interface AggregatorData {
    devices: AggregatorDeviceData[];
    testsData: TestsData;
}

export interface AggregatorDataMessage {
    type: 'aggregatorData';
    data: AggregatorData;
}

export type Message
    = AboutMessage
    | AggregatorDataMessage
    | TestResultsMessage
    | UnxpectedTestClosingMessage
    | StartTestMessage;

export interface StartTestViewerMessage {
    type: 'startTest';
    data: {
        deviceId: number;
        url: string;
    };
}

export type ViewerMessage
    = AboutMessage
    | StartTestViewerMessage;

export type MessageType = Message['type'];
