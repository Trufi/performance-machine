import * as React from 'react';
import { TestsData, TestData } from '../../server/types';

const Test = ({data}: {data: TestData}) => {
    return <ul>
        <li>Name: {data.name}</li>
        <li>URL: {data.url}</li>
        <li>Description: {data.description}</li>
        <li>Result:
            <ul>
                {data.results.map((res, i) => <li key={i}>
                    <ul>
                        <li>Date: {new Date(res.date).toString()}</li>
                        <li>DeviceId: {res.device.id}</li>
                        <li>Values: {JSON.stringify(res.values)}</li>
                    </ul>
                </li>)}
            </ul>
        </li>
    </ul>;
};

export const TestList = ({data}: {data: TestsData}) => {
    const elements = [];
    for (const url in data) {
        const test = data[url];
        elements.push(<Test data={test} />);
    }
    return <ul>
        {elements.map((el, i) => <li key={i}>{el}</li>)}
    </ul>;
};
