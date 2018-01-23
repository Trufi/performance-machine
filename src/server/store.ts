import { TestResult, TestInfo, Sample } from '../types/tests';

interface StoredTestResult {
    date: number;
    deviceId: number;
    values: Sample[];
}

interface StoredTestData {
    info: TestInfo;
    results: StoredTestResult[];
}

let idCounter = 0;

const testsData: {[id: number]: StoredTestData} = {};

export function createNewTest(info: TestInfo) {
    const id = idCounter++;
    testsData[id] = {
        info,
        results: [],
    };
}

export function saveTestResult(testId: number, deviceId: number, result: TestResult) {
    const testData = testsData[testId];

    if (!testData) {
        // TODO: логировать такой косяк
        return;
    }

    const resultToStore: StoredTestResult = {
        date: Date.now(),
        deviceId,
        values: result.values,
    };

    testData.results.push(resultToStore);
}

export function getTestInfo(testId: number): TestInfo {
    return testsData[testId].info;
}

export function getTestData(testId: number): StoredTestData {
    return testsData[testId];
}

export function getTestsInfo(): TestInfo[] {
    const res: TestInfo[] = [];
    for (const key in testsData) {
        const testData = testsData[key];
        res.push(testData.info);
    }
    return res;
}
