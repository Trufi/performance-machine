const express = require('express');
const path = require('path');
const ws = require('ws');
const fs = require('fs');

const log = (msg) => console.log(msg);

const app = express();
const port = process.env.PORT || process.env.port || 9001;
const server = app.listen(port, () => log(`Server listen on ${port} port`));

app.use(express.static(path.join(__dirname, '../client')));

const wsServer = new ws.Server({server: server});

const clients = [];
const devices = [];

let idCounter = 0;

wsServer.on('connection', ws => {
    const id = ++idCounter;
    log('Connected ' + id);
    const client = {id, ws};

    ws.on('close', () => {
        const index = devices.indexOf(client);
        if (index !== -1) {
            devices.splice(index, 1);
        }
        log('Disconnected ' + id);
    });

    ws.on('message', ev => {
        let msg;

        try {
            msg = JSON.parse(ev.data);
        } catch(err) {}

        if (!msg) {
            return;
        }

        switch (msg.type) {
            case 'about': {
                const data = msg.data;
                client.hasAbout = true;
                if (data.type === 'device') {
                    devices.push(client);
                } else {
                    clients.push(client);
                }
                client.userAgent = msg.data.userAgent;
                break;
            }
        }
    });
});

// error handlers
// eslint-disable-next-line
app.use((error, req, res, next) => {
    log(error.stack);
    res.send(error.stack);
});
