import { TestResult, ClientTestInfo, Sample } from '../types/tests';

interface StoredTestResult {
    date: number;
    deviceId: number;
    values: Sample[];
}

interface StoredTestData {
    id: number;
    url: string;
    name: string;
    description?: string;
    results: StoredTestResult[];
}

let idCounter = 0;

const testsData: {[id: number]: StoredTestData} = {};

export function createNewTest(url: string): number {
    const id = idCounter++;
    testsData[id] = {
        id,
        url,
        name: url,
        results: [],
    };
    return id;
}

export function deleteTest(id: number) {
    delete testsData[id];
}

export function saveTestResult(testId: number, deviceId: number, result: TestResult) {
    const testData = testsData[testId];

    if (!testData) {
        // TODO: логировать такой косяк
        return;
    }

    const {values, info} = result;

    const resultToStore: StoredTestResult = {
        date: Date.now(),
        deviceId,
        values,
    };

    testData.results.push(resultToStore);

    if (info) {
        testData.name = info.name;
        testData.description = info.description;
    }
}

export function getTestData(testId: number): StoredTestData {
    return testsData[testId];
}

export function getTestsInfo(): ClientTestInfo[] {
    const res: ClientTestInfo[] = [];
    for (const key in testsData) {
        const {id, name, description, url} = testsData[key];
        res.push({id, name, description, url});
    }
    return res;
}
