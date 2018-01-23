export interface Sample {
    name: string;
    values: number[];
}

export interface TestInfo {
    url: string;
    name: string;
    description: string;
    samplesCount: number;
}

export interface TestResult {
    runId: number;
    values: Sample[];
}
