export interface TestInfo {
    name: string;
    description: string;
    samplesCount: number;
}

export interface TestInfoMessage {
    type: 'testInfo';
    data: TestInfo;
}

export interface TestSampleResult {
    mean: number;
    deviation: number;
}

export interface TestSampleResultMessage {
    type: 'testSampleResult';
    data: TestSampleResult;
}

export type TestMessage
    = TestInfoMessage
    | TestSampleResultMessage;

export type Sample = ArrayLike<number>;
