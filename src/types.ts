import { TestsData } from './server/types';
import { TestSampleResult } from './caseUtils/types';

export interface AboutMessage {
    type: 'about';
    data: {
        type: 'device' | 'viewer';
        userAgent: string;
        name?: string;
        id?: number;
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
        sampleData: TestSampleResult;
    };
}

export interface UnxpectedTestClosingMessage {
    type: 'unexpectedTestClosing';
}

export interface NameFromDeviceMessage {
    type: 'name';
    data: {
        name: string;
    };
}

export interface AggregatorDeviceData {
    name?: string;
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

export interface InfoToDeviceMessage {
    type: 'info';
    data: {
        id: number;
        name?: string;
    };
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
    = StartTestMessage
    | InfoToDeviceMessage;

export type FromDeviceMessage
    = AboutMessage
    | TestResultsMessage
    | NameFromDeviceMessage
    | UnxpectedTestClosingMessage;

export type Message
    = ToViewerMessage
    | FromViewerMessage
    | ToDeviceMessage
    | FromDeviceMessage;

export type MessageType = Message['type'];
