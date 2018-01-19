export interface TestInfo {
    name: string;
    description: string;
    samplesCount: number;
}

export interface InfoTestToDeviceMessage {
    type: 'testInfo';
    data: TestInfo;
}

export interface Sample {
    name: string;
    values: number[];
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
