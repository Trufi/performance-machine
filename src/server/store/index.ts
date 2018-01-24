import { TestResult, ClientTestInfo, Sample } from '../../types/tests';
import * as fs from 'fs-extra';
import * as path from 'path';
import { StoredTestData, StoredTestResult } from './index';
import * as local from './local';
import * as logstash from './logstash';
import { getMean, getDeviation } from '../../utils';

interface SampledValues {
    name: string;
    mean: number;
    deviation: number;
}

export interface StoredTestResult {
    date: string;
    deviceId: number;
    sampledValues: SampledValues[];
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
    local.deleteAllTestResults(id);
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
        date: new Date().toString(),
        deviceId,
        sampledValues: sampleValues(values),
        values,
    };

    local.addTestResult(testId, resultToStore);
    logstash.addTestResult(testId, resultToStore);

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

export async function getAllTestData(testId: number): Promise<{
    results: StoredTestResult[];
    data: StoredTestData;
}> {
    const results = await local.getAllTestResults(testId);
    return {
        results,
        data: testList[testId],
    };
}

function sampleValues(values: Sample[]): SampledValues[] {
    const groups: {[key: string]: {name: string, mean: number[], deviation: number[]}} = {};

    values.forEach((sample) => {
        const name = sample.name;

        if (!groups[name]) {
            groups[name] = {
                name,
                mean: [],
                deviation: [],
            };
        }

        groups[name].mean.push(getMean(sample.values));
        groups[name].deviation.push(getDeviation(sample.values));
    });

    const result: SampledValues[] = [];
    for (const key in groups) {
        const group = groups[key];
        result.push({
            name: group.name,
            mean: getMean(group.mean),
            deviation: getDeviation(group.deviation),
        });
    }
    return result;
}
