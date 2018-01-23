import { Sample } from '../types/tests';
import { TestInfo } from './types';
import {
    TestToDeviceMessage,
    EndTestToDeviceMessage,
    ResultTestToDeviceMessage,
    InfoTestToDeviceMessage,
} from './types';

function send(msg: TestToDeviceMessage): void {
    const opener: Window | null = window.opener;
    if (!opener) {
        return;
    }

    opener.postMessage(JSON.stringify(msg), '*');
}

export function info(data: TestInfo): void {
    const msg: InfoTestToDeviceMessage = {
        type: 'testInfo',
        data,
    };
    send(msg);
}

export function result(data: Sample): void {
    const msg: ResultTestToDeviceMessage = {
        type: 'ResultTestToDeviceMessage',
        data: {
            values: data,
        },
    };
    send(msg);
}

export function end(): void {
    const msg: EndTestToDeviceMessage = {
        type: 'testEnd',
    };
    send(msg);
}
