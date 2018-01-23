import * as React from 'react';
import { ClientTestInfo } from '../../types/tests';

const Test = ({data}: {data: ClientTestInfo}) => {
    return <ul>
        <li>Name: {data.name}</li>
        <li>URL: {data.url}</li>
        {data.description && <li>Description: {data.description}</li>}
    </ul>;
};

export const TestList = ({data}: {data: ClientTestInfo[]}) => {
    const elements = [];
    for (const url in data) {
        const test = data[url];
        elements.push(<Test data={test} />);
    }
    return <ul>
        {elements.map((el, i) => <li key={i}>{el}</li>)}
    </ul>;
};
