import { Sample, TestInfo } from '../types/tests';

export interface InfoTestToDeviceMessage {
    type: 'testInfo';
    data: TestInfo;
}

export interface ResultTestToDeviceMessage {
    type: 'ResultTestToDeviceMessage';
    data: Sample;
}

export interface EndTestToDeviceMessage {
    type: 'testEnd';
}

export type TestToDeviceMessage
    = InfoTestToDeviceMessage
    | EndTestToDeviceMessage
    | ResultTestToDeviceMessage;
