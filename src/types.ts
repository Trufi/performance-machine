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

export interface StartTestFromViewerMessage {
    type: 'startTest';
    data: {
        deviceId: number;
        url: string;
    };
}

export type ToViewerMessage
= AggregatorDataMessage;

export type FromViewerMessage
    = AboutMessage
    | StartTestFromViewerMessage;

export type ToDeviceMessage
    = StartTestMessage;

export type FromDeviceMessage
    = AboutMessage
    | TestResultsMessage
    | UnxpectedTestClosingMessage;

export type Message
    = ToViewerMessage
    | FromViewerMessage
    | ToDeviceMessage
    | FromDeviceMessage;

export type MessageType = Message['type'];