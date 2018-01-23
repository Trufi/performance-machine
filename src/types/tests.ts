export interface Sample {
    name: string;
    values: number[];
}

export interface ClientTestInfo {
    id: number;
    url: string;
    name: string;
    description?: string;
}

export interface TestResult {
    runId: number;
    values: Sample[];
    info?: {
        name: string;
        description: string;
    };
}
