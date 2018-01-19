import * as ws from 'ws';

export interface Viewer {
    id: number;
    ws: ws;
}

export interface Device {
    name?: string;
    id: number;
    ws: ws;
    userAgent: string;
    runningTest?: {
        runId: number;
        name?: string;
        url: string;
        startTime: number;
    };
}

export interface TestData {
    url: string;
    name: string;
    description: string;
    results: Array<{
        date: number;
        device: {
            id: number;
            userAgent: string;
        };
        values: any;
    }>;
}

export interface TestsData {
    [url: string]: TestData;
}
