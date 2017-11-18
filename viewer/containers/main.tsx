import * as React from 'react';
import { ViewerMessage, StartTestViewerMessage, AggregatorData } from '../../types';
import { DeviceList } from './deviceList';

interface MainProps {
    sendMessage: (msg: ViewerMessage) => void;
}

interface MainState {
    aggregatorData?: AggregatorData;
}

export class Main extends React.Component<MainProps, MainState> {
    private inputElement: HTMLInputElement;

    constructor(props: MainProps) {
        super(props);

        this.state = {};
    }

    public render() {
        const {aggregatorData} = this.state;

        return <div>
            {aggregatorData && [
                <h1>Devices:</h1>,
                <DeviceList devices={aggregatorData.devices}/>,
            ]}
            <h1>Start test:</h1>
            <input type='text' ref={(el: HTMLInputElement) => this.inputElement = el}/>
            <input type='button' onClick={this.buttonOnClick} value='Start test'/>
        </div>;
    }

    private buttonOnClick = () => {
        const msg: StartTestViewerMessage = {
            type: 'startTest',
            data: {
                url: encodeURIComponent(this.inputElement.value),
            },
        };

        this.props.sendMessage(msg);
    }
}
