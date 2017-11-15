import { Message, AboutMessage, StartTestMessage } from '../types';

interface Test {
    window: Window;
    closeCheckInterval: NodeJS.Timer;
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

        switch (msg.type) {
            case 'startTest':
                startTest(msg);
                break;
        }
    });

    sendAbout();
}

connect();

function sendAbout() {
    const msg: AboutMessage = {
        type: 'about',
        data: {
            type: 'device',
            userAgent: navigator.userAgent,
        },
    };

    ws.send(JSON.stringify(msg));
}

function startTest(msg: StartTestMessage) {
    const {data: {url}} = msg;
    const openedWindow = window.open(url);
    if (!openedWindow) {
        console.log('open url problem');
        return;
    }

    const closeCheckInterval = setInterval(checkMaybeTestClosed, 1000);

    test = {
        window: openedWindow,
        closeCheckInterval,
    };
}

function checkMaybeTestClosed() {
    if (test && test.window.closed) {
        closeTest();
    }
}

function closeTest() {
    if (!test) {
        return;
    }

    test.window.close();
    clearInterval(test.closeCheckInterval);
    test = undefined;
}
