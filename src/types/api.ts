import { StoredTestData, StoredTestResult } from '../server/store';

export interface CreateNewTestRequest {
    url: string;
}

export interface CreateNewTestResponse {
    id: number;
}

export interface GetAllTestDataResponse {
    results: StoredTestResult[];
    data: StoredTestData;
}
