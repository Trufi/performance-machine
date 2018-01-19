import {
    AboutMessage,
    StartTestAggregatorToDeviceMessage,
    TestResultsDeviceToAggregatorMessage,
    UnxpectedTestClosingDeviceToAggregatorMessage,
    AggregatorToDeviceMessage,
    DeviceToAggregatorMessage,
    InfoAggregatorToDeviceMessage,
    NameFromDeviceMessage,
} from '../types/messages';
import { TestToDeviceMessage } from '../caseUtils/types';

const deviceIdElement = document.getElementById('device-id') as HTMLElement;
const deviceNameElement = document.getElementById('device-name') as HTMLElement;

const namePickElement = document.getElementById('name-pick') as HTMLElement;
const namePickTextElement = document.getElementById('name-pick-text') as HTMLInputElement;
const namePickButtonElement = document.getElementById('name-pick-button') as HTMLElement;
namePickButtonElement.addEventListener('click', () => {
    const name = namePickTextElement.value;
    if (!name.length || !info) {
        return;
    }

    namePickElement.style.display = 'none';
    info.name = name;
    const msg: NameFromDeviceMessage = {
        type: 'name',
        data: {
            name,
        },
    };
    sendAggregatorMessage(msg);
    updateInfo();
    saveInfoToStorage();
});

interface Test {
    runId: number;
    url: string;
    sample?: {
        window: Window;
        closeCheckInterval: NodeJS.Timer;
    };
    data?: {
        name: string;
        description: string;
        samplesCount: number;
        currentSample: number;
        values: any;
    };
}

interface Info {
    name?: string;
    id: number;
}

let test: Test | undefined;
let ws: WebSocket;
let info = getInfoFromStorage();
updateInfo();

function connect() {
    let connectTimeout: NodeJS.Timer;
    ws = new WebSocket(`ws://${location.host}/`);

    ws.addEventListener('open', () => {
        console.log('Connected');
        clearTimeout(connectTimeout);
        sendAbout();
    });

    ws.addEventListener('close', () => {
        console.log('Disconnected');
        connectTimeout = setTimeout(connect, 5 * 1000);
    });

    ws.addEventListener('message', onAggregatorMessage);
}

connect();

function onAggregatorMessage(ev: MessageEvent) {
    const msg: AggregatorToDeviceMessage = JSON.parse(ev.data);
    console.log('message', msg);

    switch (msg.type) {
        case 'startTest':
            return startTest(msg);
        case 'info':
            return setInfo(msg);
    }
}

function sendAggregatorMessage(msg: DeviceToAggregatorMessage) {
    console.log('send', msg);
    ws.send(JSON.stringify(msg));
}

function sendAbout() {
    const msg: AboutMessage = {
        type: 'about',
        data: {
            type: 'device',
            userAgent: navigator.userAgent,
        },
    };

    if (info) {
        msg.data.id = info.id;
        msg.data.name = info.name;
    }

    sendAggregatorMessage(msg);
}

function setInfo(msg: InfoAggregatorToDeviceMessage) {
    if (!info) {
        const {id, name} = msg.data;
        info = {id};
        if (name) {
            info.name = name;
        }
        updateInfo();
        saveInfoToStorage();
    }
}

function updateInfo() {
    if (!info) {
        return;
    }
    deviceIdElement.innerHTML = String(info.id);

    if (info.name) {
        deviceNameElement.innerHTML = info.name;
    } else {
        namePickElement.style.display = 'block';
    }
}

function startTest(msg: StartTestAggregatorToDeviceMessage) {
    const {data: {url, runId}} = msg;
    test = {
        runId,
        url,
    };

    startTestSample();
}

function startTestSample() {
    if (!test) {
        return;
    }

    const openedWindow = window.open(test.url);
    if (!openedWindow) {
        console.log('open url problem');
        return;
    }

    const closeCheckInterval = setInterval(checkMaybeTestClosed, 1000);

    test.sample = {
        window: openedWindow,
        closeCheckInterval,
    };

    window.addEventListener('message', onTestMessage);
}

function checkMaybeTestClosed() {
    if (test && test.sample && test.sample.window.closed) {
        unexpectedTestClosing();
    }
}

function unexpectedTestClosing() {
    closeTestSample();
    test = undefined;

    const msg: UnxpectedTestClosingDeviceToAggregatorMessage = {
        type: 'unexpectedTestClosing',
    };

    sendAggregatorMessage(msg);
}

function closeTestSample() {
    if (!test || !test.sample) {
        return;
    }

    if (test.sample.window.removeEventListener) {
        test.sample.window.removeEventListener('message', onTestMessage);
    }
    test.sample.window.close();
    clearInterval(test.sample.closeCheckInterval);
}

function onTestMessage(ev: MessageEvent) {
    console.log(ev);
    if (!test) {
        return;
    }

    const msg: TestToDeviceMessage = JSON.parse(ev.data);

    switch (msg.type) {
        case 'testInfo': {
            const {name, description, samplesCount} = msg.data;
            if (!test.data) {
                test.data = {
                    name,
                    description,
                    samplesCount,
                    currentSample: 0,
                    values: [],
                };
            }
            break;
        }

        case 'ResultTestToDeviceMessage': {
            const {data} = test;
            if (data) {
                data.values.push(msg.data);
            }
            break;
        }

        case 'testEnd': {
            const {data} = test;
            if (data) {
                closeTestSample();

                data.currentSample++;

                if (data.currentSample >= data.samplesCount) {
                    sendTestResults();
                } else {
                    startTestSample();
                }
            }
            break;
        }
    }
}

function sendTestResults() {
    if (!test || !test.data) {
        return;
    }

    const {runId, data: {name, description, values}} = test;

    const msg: TestResultsDeviceToAggregatorMessage = {
        type: 'testResults',
        data: {
            runId,
            name,
            description,
            values,
        },
    };

    sendAggregatorMessage(msg);

    test = undefined;
}

function getInfoFromStorage(): Info | undefined {
    const str = localStorage.getItem('info');
    if (str) {
        return JSON.parse(str) as Info;
    }
}

function saveInfoToStorage(): void {
    if (info) {
        localStorage.setItem('info', JSON.stringify(info));
    }
}
