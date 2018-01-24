import * as React from 'react';
import { ClientTestInfo } from '../../types/tests';

const Test = ({data, deleteCallback}: {
    data: ClientTestInfo,
    deleteCallback: (id: number) => void,
}) => {
    return <ul>
        <li>Name: {data.name}</li>
        <li>URL: {data.url}</li>
        <li>ID: {data.id}</li>
        <li><button onClick={() => deleteCallback(data.id)}>delete</button></li>
        {data.description && <li>Description: {data.description}</li>}
    </ul>;
};

export const TestList = ({data, deleteCallback}: {
    data: ClientTestInfo[],
    deleteCallback: (id: number) => void,
}) => {
    const elements = [];
    for (const url in data) {
        const test = data[url];
        elements.push(<Test data={test} deleteCallback={deleteCallback}/>);
    }
    return <ul>
        {elements.map((el, i) => <li key={i}>{el}</li>)}
    </ul>;
};
