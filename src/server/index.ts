import * as express from 'express';
import * as path from 'path';
import * as ws from 'ws';
import {
    Message,
    AboutMessage,
    TestResultsMessage,
    AggregatorDataMessage,
    FromViewerMessage,
    StartTestMessage,
    FromDeviceMessage,
} from '../types';
import { Viewer, Device, TestsData } from './types';

const log = (msg: string | undefined) => console.log(msg);

const app = express();
const port = process.env.PORT || process.env.port || 3000;
const server = app.listen(port, () => log(`Server listen on ${port} port`));

app.use(express.static(path.join(__dirname, '../../dist')));

const wsServer = new ws.Server({server});

const testsData: TestsData = {};

let testRunIdCounter = 0;

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

        console.log(msg);

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

function parseMessage(data: ws.Data): any | undefined {
    if (typeof data !== 'string') {
        return;
    }

    let msg: any | undefined;

    try {
        msg = JSON.parse(data);
    } catch (err) {}

    return msg;
}

function initializeDevice(id: number, ws: ws, data: AboutMessage['data']): void {
    const {userAgent} = data;
    const device: Device = {
        id,
        ws,
        userAgent,
    };
    devices.push(device);
    sendDataToViewers();
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
        // TODO: device removing
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

    sendMessage(ws, getAggregatorDataMessage());
}

function sendMessage(ws: ws, msg: Message) {
    console.log('send', msg);
    ws.send(JSON.stringify(msg));
}

function deviceOnMessage(device: Device, msg: FromDeviceMessage) {
    console.log('device', msg);

    switch (msg.type) {
        case 'testResults':
            return saveTestData(device, msg);
        case 'unexpectedTestClosing':
            return freeDevice(device);
    }
}

function viewerOnMessage(_viewer: Viewer, msg: FromViewerMessage) {
    console.log('viewer', msg);

    switch (msg.type) {
        case 'startTest':
            return startTest(msg.data.deviceId, msg.data.url);
    }
}

function saveTestData(device: Device, msg: TestResultsMessage) {
    const {data: {runId, name, description, sampleData}} = msg;

    if (
        !device.runningTest ||
        device.runningTest.runId !== runId
    ) {
        return;
    }

    const {runningTest: {url}} = device;

    if (!testsData[url]) {
        testsData[url] = {
            url,
            name,
            description,
            results: [],
        };
    }

    const testData = testsData[url];
    testData.results.push({
        date: Date.now(),
        device: {
            id: device.id,
            userAgent: device.userAgent,
        },
        sampleData,
    });

    freeDevice(device);
    sendDataToViewers();
}

function freeDevice(device: Device) {
    device.runningTest = undefined;
    sendDataToViewers();
}

function getAggregatorDataMessage(): AggregatorDataMessage {
    return {
        type: 'aggregatorData',
        data: {
            devices: devices.map(({id, userAgent, runningTest}) => ({id, userAgent, runningTest})),
            testsData,
        },
    };
}

function sendDataToViewers() {
    const msg = getAggregatorDataMessage();
    viewers.forEach((viewer) => sendMessage(viewer.ws, msg));
}

function startTest(deviceId: number, url: string) {
    const device = devices.find((el) => el.id === deviceId);

    if (!device || device.runningTest) {
        return;
    }

    const runId = testRunIdCounter++;

    device.runningTest = {
        startTime: Date.now(),
        url,
        runId,
    };

    const msg: StartTestMessage = {
        type: 'startTest',
        data: {
            runId,
            url,
        },
    };

    sendMessage(device.ws, msg);
    sendDataToViewers();
}

// error handlers
app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    log(error.stack);
    res.send(error.stack);
});
