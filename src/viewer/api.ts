import axios from 'axios';
import { CreateNewTestRequest, CreateNewTestResponse, GetAllTestDataResponse } from '../types/api';

const instance = axios.create({
    baseURL: location.origin + '/api',
});

export async function createNewTest(url: string) {
    const data: CreateNewTestRequest = {url};
    return instance.post<CreateNewTestResponse>('test', data);
}

export async function startTest(testId: number, deviceId: number) {
    return instance.get(`start/test/${testId}/device/${deviceId}`);
}

export async function deleteTest(testId: number) {
    return instance.delete(`test/${testId}`);
}

export async function getAllTestData(testId: number) {
    return instance.get<GetAllTestDataResponse>(`test/${testId}`);
}
