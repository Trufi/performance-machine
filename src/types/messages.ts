import { TestsData } from '../server/types';

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
    data: {
        runId: number;
        name: string;
        description: string;
        values: any;
    };
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

export interface InfoAggregatorToDeviceMessage {
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
