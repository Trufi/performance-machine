import * as React from 'react';
import { render } from 'react-dom';
import { Main } from './containers/main';
import { FromViewerMessage, AboutMessage, AggregatorData, ToViewerMessage } from '../types';

const main = render(
    <Main sendMessage={sendMessage}/>,
    document.getElementById('root'),
) as Main;

function renderAggregatorData(data: AggregatorData) {
    console.log(data);
    main.setState({
        ...main.state,
        aggregatorData: data,
    });
}

let ws: WebSocket;

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

    ws.addEventListener('message', onMessage);
}

connect();

function sendMessage(msg: FromViewerMessage) {
    console.log('send', msg);
    ws.send(JSON.stringify(msg));
}

function sendAbout() {
    const msg: AboutMessage = {
        type: 'about',
        data: {
            type: 'viewer',
            userAgent: '',
        },
    };

    sendMessage(msg);
}

function onMessage(ev: MessageEvent) {
    const msg: ToViewerMessage = JSON.parse(ev.data);
    console.log('message', msg);

    switch (msg.type) {
        case 'aggregatorData':
            return renderAggregatorData(msg.data);
    }
}
