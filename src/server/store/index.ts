import { TestResult, ClientTestInfo, Sample } from '../../types/tests';
import * as fs from 'fs-extra';
import * as path from 'path';
import { StoredTestData, StoredTestResult } from './index';
import * as local from './local';

export interface StoredTestResult {
    date: number;
    deviceId: number;
    values: Sample[];
}

export interface StoredTestData {
    id: number;
    url: string;
    name: string;
    description?: string;
}

const dataBasePath = path.join(__dirname, '../../../data');
const testListPath = path.join(dataBasePath, 'testList.json');

let testList: {[id: number]: StoredTestData};
try {
    testList = fs.readJsonSync(testListPath);
} catch (err) {
    testList = {};
}

function saveTestList() {
    fs.writeJson(testListPath, testList);
}

let idCounter = 0;

export function createNewTest(url: string): number {
    const id = idCounter++;
    testList[id] = {
        id,
        url,
        name: url,
    };

    saveTestList();

    return id;
}

export function deleteTest(id: number) {
    delete testList[id];
    saveTestList();
}

export function saveTestResult(testId: number, deviceId: number, result: TestResult) {
    const testData = testList[testId];

    if (!testData) {
        // TODO: логировать такой косяк или не косяк, а тест был удален
        return;
    }

    const {values, info} = result;

    const resultToStore: StoredTestResult = {
        date: Date.now(),
        deviceId,
        values,
    };

    local.addTestResult(testId, resultToStore);

    if (info) {
        testData.name = info.name;
        testData.description = info.description;
        saveTestList();
    }
}

export function getTestData(testId: number): StoredTestData {
    return testList[testId];
}

export function getTestsInfo(): ClientTestInfo[] {
    const res: ClientTestInfo[] = [];
    for (const key in testList) {
        const {id, name, description, url} = testList[key];
        res.push({id, name, description, url});
    }
    return res;
}
