import * as React from 'react';
import * as api from '../api';
import { RouteComponentProps } from 'react-router-dom';
import { GetAllTestDataResponse } from '../../types/api';
import { StoredTestResult } from '../../server/store';
import {
    LineChart,
    Line,
    YAxis,
    Tooltip,
} from 'recharts';

const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);

const TestResult = ({result}: {result: StoredTestResult}) => {
    const data: any = [];
    const counters: {[name: string]: number} = {};
    const dataProperties: string[] = [];

    result.values.forEach((sample) => {
        const {name, values} = sample;

        if (!counters[name]) {
            counters[name] = 0;
        }

        const dataName = name + ' ' + counters[name]++;
        dataProperties.push(dataName);

        values.forEach((x, i) => {
            if (data[i] === undefined) {
                data[i] = {
                    i,
                };
            }
            data[i][dataName] = Math.round(x * 1e3) / 1e3;
        });
    });

    return <div>
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
        <LineChart width={730} height={250} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <YAxis/>
            <Tooltip/>
            {dataProperties.map((property) =>
                <Line key={property} type='monotone' dataKey={property}
                    stroke={randomColor()} dot={false}/>)}
        </LineChart>
    </div>;
};

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
