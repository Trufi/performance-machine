import { Message, AboutMessage, StartTestMessage, TestResultsMessage, UnxpectedTestClosingMessage } from '../types';
import { TestMessage, TestSampleResult } from '../caseUtils/types';

interface Test {
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

let test: Test | undefined;
let ws: WebSocket;

function connect() {
    let connectTimeout: NodeJS.Timer;
    ws = new WebSocket(`ws://${location.host}/`);

    ws.addEventListener('open', () => {
        console.log('Connected');
        clearTimeout(connectTimeout);
    });

    ws.addEventListener('close', () => {
        console.log('Disconnected');
        connectTimeout = setTimeout(connect, 5 * 1000);
    });

    ws.addEventListener('message', (ev) => {
        const msg: Message = JSON.parse(ev.data);
        console.log('message', msg);

        switch (msg.type) {
            case 'startTest':
                startTest(msg);
                break;
        }
    });

    sendAbout();
}

connect();

function sendMessage(msg: Message) {
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

    sendMessage(msg);
}

function startTest(msg: StartTestMessage) {
    const {data: {url}} = msg;
    test = {
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

    openedWindow.addEventListener('message', onTestMessage);
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

    sendMessage(msg);
}

function closeTestSample() {
    if (!test || !test.sample) {
        return;
    }

    test.sample.window.removeEventListener('message', (onTestMessage));
    test.sample.window.close();
    clearInterval(test.sample.closeCheckInterval);
}

function onTestMessage(ev: MessageEvent) {
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

    const msg: TestResultsMessage = {
        type: 'testResults',
        data: {
            samples: test.data.samplesData,
        },
    };

    sendMessage(msg);

    test = undefined;
}
