import { TestResult, ClientTestInfo } from './tests';

export interface AboutMessage {
    type: 'about';
    data: {
        type: 'device' | 'viewer';
        userAgent: string;
        name?: string;
        id?: number;
    };
}

export interface StartTestAggregatorToDeviceMessage {
    type: 'startTest';
    data: {
        runId: number;
        url: string;
    };
}

export interface TestResultsDeviceToAggregatorMessage {
    type: 'testResults';
    data: TestResult;
}

export interface UnxpectedTestClosingDeviceToAggregatorMessage {
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
        testId: number;
        startTime: number;
    };
}

export interface AggregatorData {
    devices: AggregatorDeviceData[];
    testsInfo: ClientTestInfo[];
}

export interface AggregatorDataMessage {
    type: 'aggregatorData';
    data: AggregatorData;
}

export interface InfoAggregatorToDeviceMessage {
    type: 'info';
    data: {
        id: number;
        name?: string;
    };
}

export type ToViewerMessage
    = AggregatorDataMessage;

export type FromViewerMessage
    = AboutMessage;

export type AggregatorToDeviceMessage
    = StartTestAggregatorToDeviceMessage
    | InfoAggregatorToDeviceMessage;

export type DeviceToAggregatorMessage
    = AboutMessage
    | TestResultsDeviceToAggregatorMessage
    | NameFromDeviceMessage
    | UnxpectedTestClosingDeviceToAggregatorMessage;

export type Message
    = ToViewerMessage
    | FromViewerMessage
    | AggregatorToDeviceMessage
    | DeviceToAggregatorMessage;

export type MessageType = Message['type'];
