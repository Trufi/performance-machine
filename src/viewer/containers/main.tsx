import * as React from 'react';
import { FromViewerMessage, StartTestFromViewerMessage, AggregatorData } from '../../types';
import { DeviceList } from './deviceList';

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

        const {devices} = aggregatorData;

        return <div>
            <h1>Devices:</h1>
            <DeviceList devices={devices}/>
            <h1>Start test:</h1>
            <select ref={(el: HTMLSelectElement) => this.selectElement = el}>
                {devices.map((device, i) => <option key={i} value={device.id}>{device.id}</option>)}
            </select>
            <input type='text' ref={(el: HTMLInputElement) => this.inputElement = el}/>
            <input type='button' onClick={this.buttonOnClick} value='Start test'/>
        </div>;
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
