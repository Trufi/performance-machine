import * as React from 'react';
import {
    HashRouter as Router,
    Route,
    Link,
} from 'react-router-dom';
import { Common } from './common';
import { NewTest } from './newTest';
import { FromViewerMessage, AggregatorData } from '../../types/messages';
import { TestResults } from './testResults';

interface MainProps {
    sendMessage: (msg: FromViewerMessage) => void;
}

interface MainState {
    aggregatorData?: AggregatorData;
}

export class Main extends React.Component<MainProps, MainState> {
    constructor(props: MainProps) {
        super(props);

        this.state = {};
    }

    public render() {
        const {sendMessage} = this.props;
        const {aggregatorData} = this.state;

        const componentProps = {
            sendMessage,
            aggregatorData,
        };

        return <Router>
            <div>
                <nav>
                    <Link to='/'>Home</Link>{' | '}
                    <Link to='/new-test'>Create new test</Link>
                </nav>
                <Route exact path='/' render={(props) => <Common {...componentProps} {...props}/>}/>
                <Route path='/new-test' render={(props) => <NewTest {...componentProps} {...props}/>}/>
                <Route path='/test/:testId' render={(props) => <TestResults {...props}/>}/>
            </div>
        </Router>;
    }
}
