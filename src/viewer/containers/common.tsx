import * as React from 'react';
import { StartTestFromViewerMessage, AggregatorData, FromViewerMessage } from '../../types/messages';
import { DeviceList } from './deviceList';
import { TestList } from './testList';

interface CommonProps {
    sendMessage: (msg: FromViewerMessage) => void;
    aggregatorData?: AggregatorData;
}

export class Common extends React.Component<CommonProps, {}> {
    private selectDeviceElement: HTMLSelectElement;
    private selectTestElement: HTMLSelectElement;

    public render() {
        const {aggregatorData} = this.props;

        let devicesHtml = <div>No devices</div>;
        if (aggregatorData && aggregatorData.devices.length) {
            const {devices} = aggregatorData;

            devicesHtml = <div>
                <DeviceList devices={devices}/>
            </div>;
        }

        let testsHtml = <div>No test results</div>;
        if (aggregatorData && aggregatorData.testsInfo.length) {
            testsHtml = <TestList data={aggregatorData.testsInfo}/>;
        }

        let startTestHtml;
        if (aggregatorData && aggregatorData.devices.length && aggregatorData.testsInfo.length) {
            const {devices, testsInfo} = aggregatorData;
            startTestHtml = <div>
                <h1>Start test</h1>
                <label>
                    Device ID:&nbsp;
                    <select ref={(el: HTMLSelectElement) => this.selectDeviceElement = el}>
                        {devices.map((device, i) => <option key={i} value={device.id}>{device.id}</option>)}
                    </select>
                </label>
                <br/>
                <label>
                    TestID:&nbsp;
                    <select ref={(el: HTMLSelectElement) => this.selectTestElement = el}>
                        {testsInfo.map((test, i) => <option key={i} value={test.id}>{test.id}</option>)}
                    </select>
                </label>
                <br/>
                <button onClick={this.buttonOnClick}>Start</button>
            </div>;
        }

        return <div>
            <h1>Devices</h1>
            {devicesHtml}
            <h1>Test list</h1>
            {testsHtml}
            {startTestHtml}
        </div>;
    }

    private buttonOnClick = () => {
        const msg: StartTestFromViewerMessage = {
            type: 'startTest',
            data: {
                deviceId: Number(this.selectDeviceElement.value),
                testId: Number(this.selectTestElement.value),
            },
        };

        this.props.sendMessage(msg);
    }
}
