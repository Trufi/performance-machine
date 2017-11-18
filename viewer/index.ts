import { renderAggregatorData } from './render';
import { Message, AboutMessage } from '../types';

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

    ws.addEventListener('message', onMessage);

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
            type: 'client',
            userAgent: '',
        },
    };

    sendMessage(msg);
}

function onMessage(ev: MessageEvent) {
    const msg: Message = JSON.parse(ev.data);
    console.log('message', msg);

    switch (msg.type) {
        case 'startTest':
            break;
    }
}

renderAggregatorData('123');
