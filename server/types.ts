import * as ws from 'ws';

export interface Viewer {
    id: number;
    ws: ws;
}

export interface Device {
    id: number;
    ws: ws;
    userAgent: string;
}
