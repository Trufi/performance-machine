import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as api from '../api';
import { ClientTestInfo } from '../../types/tests';

interface TestProps {
    data: ClientTestInfo;
    history: RouteComponentProps<any>['history'];
}

export class Test extends React.Component<TestProps, {}> {
    public render() {
        const {name, url, id, description} = this.props.data;
        return <ul>
            <li>Name: {name}</li>
            <li>URL: {url}</li>
            <li>ID: {id}</li>
            {description && <li>Description: {description}</li>}
            <li><button onClick={this.deleteOnClick}>delete</button></li>
            <li><button onClick={this.showOnClick}>show results</button></li>
        </ul>;
    }

    private deleteOnClick = () => {
        const {data: {id}} = this.props;
        const result = confirm(`Do you want to delete test with id: ${id}?`);
        if (result) {
            try {
                api.deleteTest(id);
            } catch (err) {
                console.log(err, err.response);
            }
        }
    }

    private showOnClick = () => {
        const {data: {id}, history} = this.props;
        history.push(`/test/${id}`);
    }
}

export const TestList = ({data, history}: {
    data: ClientTestInfo[],
    history: RouteComponentProps<any>['history'],
}) => {
    const elements = [];
    for (const url in data) {
        const test = data[url];
        elements.push(<Test data={test} history={history}/>);
    }
    return <ul>
        {elements.map((el, i) => <li key={i}>{el}</li>)}
    </ul>;
};
