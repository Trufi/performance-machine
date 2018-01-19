export interface AnyTest {
    name: string;
    description?: string;
}

export interface UrlTest extends AnyTest {
    url: string;
}

export interface UrlTestResult {
    testName: string;
    date: number;
    deviceId: number;
    data: RawData[] | SampledData[];
}

export interface SampledData {
    type: 'sampled';
    metric: string;
    sampleLength: number;
    mean: number;
    deviation: number;
}

export interface RawData {
    type: 'raw';
    metric: string;
    values: number[];
}
