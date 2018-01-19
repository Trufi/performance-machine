import * as React from 'react';
import { FromViewerMessage, StartTestFromViewerMessage, AggregatorData } from '../../types/messages';
import { DeviceList } from './deviceList';
import { TestList } from './testList';

interface MainProps {
    sendMessage: (msg: FromViewerMessage) => void;
}

interface MainState {
    aggregatorData?: AggregatorData;
}

export class Main extends React.Component<MainProps, MainState> {
    private selectElement: HTMLSelectElement;
    private inputElement: HTMLInputElement;

    constructor(props: MainProps) {
        super(props);

        this.state = {};
    }

    public render() {
        const {aggregatorData} = this.state;

        if (!aggregatorData || !aggregatorData.devices.length) {
            return <div>No devices</div>;
        }

        const {devices, testsData} = aggregatorData;

        return <div>
            <h1>Devices:</h1>
            <DeviceList devices={devices}/>
            <h1>Start test:</h1>
            <select ref={(el: HTMLSelectElement) => this.selectElement = el}>
                {devices.map((device, i) => <option key={i} value={device.id}>{device.id}</option>)}
            </select>
            <input type='text' ref={(el: HTMLInputElement) => this.inputElement = el}
                value='http://localhost:3000/examples' onKeyPress={this.onKeyPress}/>
            <input type='button' onClick={this.buttonOnClick} value='Start test'/>
            <h1>Tests results:</h1>
            <TestList data={testsData}/>
        </div>;
    }

    private onKeyPress = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (ev.which === 13) {
            this.buttonOnClick();
        }
    }

    private buttonOnClick = () => {
        const msg: StartTestFromViewerMessage = {
            type: 'startTest',
            data: {
                deviceId: Number(this.selectElement.value),
                url: this.inputElement.value,
            },
        };

        this.props.sendMessage(msg);
    }
}
