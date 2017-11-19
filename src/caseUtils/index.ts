import {
    TestMessage,
    Sample,
    TestEndMessage,
    TestSampleResultMessage,
    TestSampleResult,
    TestInfo,
    TestInfoMessage,
} from './types';

function send(msg: TestMessage): void {
    const opener: Window | null = window.opener;
    if (!opener) {
        return;
    }

    opener.postMessage(JSON.stringify(msg), '*');
}

export function info(data: TestInfo): void {
    const msg: TestInfoMessage = {
        type: 'testInfo',
        data,
    };
    send(msg);
}

export function result(data: TestSampleResult): void {
    const msg: TestSampleResultMessage = {
        type: 'testSampleResult',
        data,
    };
    send(msg);
}

export function end(): void {
    const msg: TestEndMessage = {
        type: 'testEnd',
    };
    send(msg);
}

export function getMean(sample: Sample): number {
    let mean = sample[0];

    for (let i = 1; i < sample.length; i++) {
        mean += sample[i];
    }

    mean /= sample.length;

    return mean;
}

export function getDeviation(sample: Sample): number {
    const mean = getMean(sample);
    let dispersion = 0;

    for (let i = 0; i < sample.length; i++) {
        dispersion += Math.pow(sample[i] - mean, 2);
    }

    return dispersion / sample.length;
}
