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
        testId: number;
        runId: number;
        startTime: number;
    };
}
