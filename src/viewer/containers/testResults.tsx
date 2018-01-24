import * as React from 'react';
import * as api from '../api';
import { RouteComponentProps } from 'react-router-dom';
import { GetAllTestDataResponse } from '../../types/api';
import { StoredTestResult } from '../../server/store';
import { Sample } from '../../types/tests';

interface SampleDrawerProps {
    sample: Sample;
}

class SampleDrawer extends React.Component<SampleDrawerProps, {}> {
    public render() {
        return <div>{JSON.stringify(this.props.sample)}</div>;
    }
}

const TestResult = ({result}: {result: StoredTestResult}) => <div>
    <h2>{result.date}</h2>
    <ul>
        <li>DeviceId: {result.deviceId}</li>
        <li>Sampled:
            <ul>
                {result.sampledValues.map((sampled, i) => <li key={i}>
                    <ul>
                        <li>Name: {sampled.name}</li>
                        <li>Mean: {sampled.mean.toFixed(3)}</li>
                        <li>Deviation: {sampled.deviation.toFixed(3)}</li>
                    </ul>
                </li>)}
            </ul>
        </li>
    </ul>
    {result.values.map((sample, i) => <SampleDrawer key={i} sample={sample}/>)}
</div>;

interface InitialState {
    status: 'initial';
}

interface LoadedState {
    status: 'loaded';
    data: GetAllTestDataResponse;
}

type TestResultsState = InitialState | LoadedState;

type TestResultsProps = RouteComponentProps<any>;

export class TestResults extends React.Component<TestResultsProps, TestResultsState> {
    constructor(props: TestResultsProps) {
        super(props);

        this.state = {
            status: 'initial',
        };
    }

    public componentDidMount() {
        const testId = Number(this.props.match.params.testId);

        if (isNaN(testId)) {
            return;
        }

        (async () => {
            try {
                const response = await api.getAllTestData(testId);
                const newState: LoadedState = {
                    status: 'loaded',
                    data: response.data,
                };
                this.setState(newState);
            } catch (err) {}
        })();
    }

    public render() {
        if (this.state.status === 'loaded') {
            const {data: {name, id, description, url}, results} = this.state.data;
            return <div>
                <h1>Test information</h1>
                <ul>
                    <li>Name: {name}</li>
                    <li>URL: {url}</li>
                    <li>ID: {id}</li>
                    {description && <li>Description: {description}</li>}
                </ul>
                <h1>Test results</h1>
                {results.map((result, i) => <TestResult key={i} result={result}/>)}
            </div>;
        }

        return <div>Loading...</div>;
    }
}
