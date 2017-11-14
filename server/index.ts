import * as express from 'express';
import * as path from 'path';
import * as ws from 'ws';
import { Message, AboutMessage } from '../types';
import { Viewer, Device } from './types';

const log = (msg: string | undefined) => console.log(msg);

const app = express();
const port = process.env.PORT || process.env.port || 9001;
const server = app.listen(port, () => log(`Server listen on ${port} port`));

app.use(express.static(path.join(__dirname, '../client')));

const wsServer = new ws.Server({server});

const viewers: Viewer[] = [];
const devices: Device[] = [];

let idCounter = 0;

wsServer.on('connection', (ws) => {
    const id = ++idCounter;
    log('Connected ' + id);

    ws.once('message', (data: ws.Data) => {
        const msg = parseMessage(data);
        if (!msg) {
            return;
        }

        switch (msg.type) {
            case 'about': {
                const data = msg.data;
                if (data.type === 'device') {
                    initializeDevice(id, ws, data);
                } else {
                    initializeViewer(id, ws, data);
                }
                break;
            }
        }
    });
});

function parseMessage(data: ws.Data): Message | undefined {
    if (typeof data !== 'string') {
        return;
    }

    let ev: any;

    try {
        ev = JSON.parse(data);
    } catch (err) {}

    return ev.data as Message | undefined;
}

function initializeDevice(id: number, ws: ws, data: AboutMessage['data']): void {
    const {userAgent} = data;
    const device: Device = {
        id,
        ws,
        userAgent,
    };
    devices.push(device);
    ws.on('message', (data) => {
        const msg = parseMessage(data);
        if (msg) {
            deviceOnMessage(device, msg);
        }
    });
    ws.on('close', () => {
        const index = devices.indexOf(device);
        if (index !== -1) {
            devices.splice(index, 1);
        }
        log('Disconnected device' + id);
    });
}

function initializeViewer(id: number, ws: ws, _data: AboutMessage['data']): void {
    const viewer: Viewer = {
        id,
        ws,
    };
    viewers.push(viewer);
    ws.on('message', (data) => {
        const msg = parseMessage(data);
        if (msg) {
            viewerOnMessage(viewer, msg);
        }
    });
    ws.on('close', () => {
        const index = viewers.indexOf(viewer);
        if (index !== -1) {
            viewers.splice(index, 1);
        }
        log('Disconnected viewer' + id);
    });
}

function deviceOnMessage(device: Device, msg: Message) {
    console.log(device, msg);
}

function viewerOnMessage(viewer: Viewer, msg: Message) {
    console.log(viewer, msg);
}

// error handlers
app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    log(error.stack);
    res.send(error.stack);
});
