import {
    AboutMessage,
    StartTestMessage,
    TestResultsMessage,
    UnxpectedTestClosingMessage,
    ToDeviceMessage,
    FromDeviceMessage,
    InfoToDeviceMessage,
    NameFromDeviceMessage,
} from '../types';
import { TestMessage, TestSampleResult } from '../caseUtils/types';
import { getMean } from '../caseUtils';

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
        samplesData: TestSampleResult[];
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
    const msg: ToDeviceMessage = JSON.parse(ev.data);
    console.log('message', msg);

    switch (msg.type) {
        case 'startTest':
            return startTest(msg);
        case 'info':
            return setInfo(msg);
    }
}

function sendAggregatorMessage(msg: FromDeviceMessage) {
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

function setInfo(msg: InfoToDeviceMessage) {
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

function startTest(msg: StartTestMessage) {
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

    const msg: UnxpectedTestClosingMessage = {
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

    const msg: TestMessage = JSON.parse(ev.data);

    switch (msg.type) {
        case 'testInfo': {
            const {name, description, samplesCount} = msg.data;
            if (!test.data) {
                test.data = {
                    name,
                    description,
                    samplesCount,
                    currentSample: 0,
                    samplesData: [],
                };
            }
            break;
        }

        case 'testSampleResult': {
            const {data} = test;
            if (data) {
                data.samplesData.push(msg.data);
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

    const {runId, data: {name, description, samplesData}} = test;

    const mean = getMean(samplesData.map((data) => data.mean));
    const deviation = getMean(samplesData.map((data) => data.deviation));

    const msg: TestResultsMessage = {
        type: 'testResults',
        data: {
            runId,
            name,
            description,
            sampleData: {
                mean,
                deviation,
            },
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
