import { TestData } from './types';
import * as graylog2 from 'graylog2';

const logger = new graylog2.graylog({
    servers: [{
        host: 'logstash.test',
        port: 12201,
    }],
    hostname: 'any',
    facility: 'Node.js',
    bufferSize: 1350,
});

logger.on('error', (error: any) => {
    console.error('Error while trying to write to graylog2: ', error);
});

function log(obj: object) {
    const msgObj = Object.assign({}, obj, {
        team: 'webmaps',
        project: 'performance_test',
    });
    logger.log('size', msgObj);
}

export function sendToLogstash(data: TestData) {
    const {name, url, description, results} = data;

    results.forEach((result) => {
        const {device} = result;

        const msg = {

        }
    });
}
