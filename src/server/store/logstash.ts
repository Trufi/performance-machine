import * as graylog2 from 'graylog2';
import * as store from './index';

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
    const msgObj = {
        ...obj,
        team: 'webmaps',
        project: 'performance_test',
    };
    logger.log('size', msgObj);
    console.log('logstash log', msgObj);
}

export async function addTestResult(testId: number, result: store.StoredTestResult) {
    const info = store.getTestData(testId);

    result.sampledValues.forEach((sampledValues) => {
        const msg = {
            test: info,
            deviceId: result.deviceId,
            result: sampledValues,
        };
        log(msg);
    });
}
