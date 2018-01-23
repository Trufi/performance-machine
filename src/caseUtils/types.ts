import { Sample } from '../types/tests';

export interface TestInfo {
    name: string;
    description: string;
}

export interface InfoTestToDeviceMessage {
    type: 'testInfo';
    data: TestInfo;
}

export interface ResultTestToDeviceMessage {
    type: 'ResultTestToDeviceMessage';
    data: {
        values: Sample;
    };
}

export interface EndTestToDeviceMessage {
    type: 'testEnd';
}

export type TestToDeviceMessage
    = InfoTestToDeviceMessage
    | EndTestToDeviceMessage
    | ResultTestToDeviceMessage;
