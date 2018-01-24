import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as path from 'path';
import * as ws from 'ws';
import {
    Message,
    AboutMessage,
    TestResultsDeviceToAggregatorMessage,
    AggregatorDataMessage,
    FromViewerMessage,
    StartTestAggregatorToDeviceMessage,
    DeviceToAggregatorMessage,
    InfoAggregatorToDeviceMessage,
} from '../types/messages';
import { Viewer, Device } from './types';
import * as store from './store';
import { CreateNewTestResponse, CreateNewTestRequest } from '../types/api';

const log = (msg: string | undefined) => console.log(msg);

const app = express();
const port = process.env.PORT || process.env.port || 3000;
const server = app.listen(port, () => log(`Server listen on ${port} port`));

app.use(express.static(path.join(__dirname, '../../dist')));

const wsServer = new ws.Server({server});

let testRunIdCounter = 0;

const viewers: Viewer[] = [];
const devices: Device[] = [];

let idCounter = 0;

wsServer.on('connection', (ws) => {
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
                    initializeDevice(ws, data);
                } else {
                    initializeViewer(ws, data);
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

function initializeDevice(ws: ws, data: AboutMessage['data']): void {
    const {userAgent} = data;
    const id = data.id !== undefined ? data.id : idCounter;
    idCounter = id + 1;

    const device: Device = {
        id,
        ws,
        userAgent,
    };
    if (data.name) {
        device.name = data.name;
    }
    devices.push(device);
    sendDataToViewers();

    log('Connect device ' + id);

    // If device has no own id
    if (data.id === undefined) {
        const msg: InfoAggregatorToDeviceMessage = {
            type: 'info',
            data: {
                id,
            },
        };
        sendMessage(ws, msg);
    }

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
        log('Disconnected device ' + id);
        // TODO: device removing
    });
}

function initializeViewer(ws: ws, _data: AboutMessage['data']): void {
    const id = idCounter++;
    const viewer: Viewer = {
        id,
        ws,
    };
    viewers.push(viewer);

    log('Connect viewer ' + id);

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
        log('Disconnected viewer ' + id);
    });

    sendMessage(ws, getAggregatorDataMessage());
}

function sendMessage(ws: ws, msg: Message) {
    console.log('send', msg);
    ws.send(JSON.stringify(msg));
}

function deviceOnMessage(device: Device, msg: DeviceToAggregatorMessage) {
    console.log('device', msg);

    switch (msg.type) {
        case 'testResults':
            return onTestResultMsg(device, msg);
        case 'unexpectedTestClosing':
            return freeDevice(device);
        case 'name':
            return device.name = msg.data.name;
    }
}

function viewerOnMessage(_viewer: Viewer, msg: FromViewerMessage) {
    console.log('viewer', msg);
}

function onTestResultMsg(device: Device, msg: TestResultsDeviceToAggregatorMessage) {
    if (
        !device.runningTest ||
        device.runningTest.runId !== msg.data.runId
    ) {
        return;
    }

    const {runningTest: {testId}} = device;
    store.saveTestResult(testId, device.id, msg.data);
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
            devices: devices.map(({name, id, userAgent, runningTest}) => ({name, id, userAgent, runningTest})),
            testsInfo: store.getTestsInfo(),
        },
    };
}

function sendDataToViewers() {
    const msg = getAggregatorDataMessage();
    viewers.forEach((viewer) => sendMessage(viewer.ws, msg));
}

function startTest(deviceId: number, testId: number) {
    const device = devices.find((el) => el.id === deviceId);

    if (!device || device.runningTest) {
        return `Device with id: ${deviceId} not found`;
    }

    const testData = store.getTestData(testId);
    if (!testData) {
        return `Test with id: ${testId} not found`;
    }

    const runId = testRunIdCounter++;

    device.runningTest = {
        startTime: Date.now(),
        runId,
        testId,
    };

    const msg: StartTestAggregatorToDeviceMessage = {
        type: 'startTest',
        data: {
            runId,
            url: store.getTestData(testId).url,
        },
    };

    sendMessage(device.ws, msg);
    sendDataToViewers();
}

app.use('/api', bodyParser.json());

app.get('/api/start/test/:testId/device/:deviceId', (req, res) => {
    log(`/api/start/test, testId: ${req.params.testId}, deviceId: ${req.params.deviceId}`);

    const testId = Number(req.params.testId);
    const deviceId = Number(req.params.deviceId);

    if (isNaN(testId) || isNaN(deviceId)) {
        return res.status(400).send('DeviceId or testId not a number');
    }

    const err = startTest(deviceId, testId);
    if (err) {
        return res.status(400).send(err);
    }

    res.send('OK');
});

app.post('/api/test', (req, res) => {
    log(`/api/test, url: ${req.body.url}`);

    if (typeof req.body.url !== 'string' || req.body.url.length === 0) {
        return res.status(400).send();
    }

    const body: CreateNewTestRequest = req.body;
    const id = store.createNewTest(body.url);
    const response: CreateNewTestResponse = {id};
    res.json(response);

    sendDataToViewers();
});

// error handlers
app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    log(error.stack);
    res.send(error.stack);
});
