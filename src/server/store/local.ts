import * as fs from 'fs-extra';
import * as path from 'path';
import { StoredTestResult } from './index';

const dataBasePath = path.join(__dirname, '../../../data');
const testResultsDirPath = path.join(dataBasePath, 'tests');

fs.ensureDirSync(dataBasePath);
fs.ensureDirSync(testResultsDirPath);

export async function getAllTestResults(testId: number): Promise<StoredTestResult[]> {
    const testResultsPath = path.join(testResultsDirPath, String(testId) + '.json');
    await fs.ensureFile(testResultsPath);

    try {
        return await fs.readJson(testResultsPath);
    } catch (err) {
        return [];
    }
}

export async function addTestResult(testId: number, result: StoredTestResult) {
    const testResultsPath = path.join(testResultsDirPath, String(testId) + '.json');
    const testResults = await getAllTestResults(testId);
    testResults.push(result);

    fs.writeJson(testResultsPath, testResults);
}
