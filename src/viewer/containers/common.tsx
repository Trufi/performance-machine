import * as React from 'react';
import { AggregatorData, FromViewerMessage } from '../../types/messages';
import { DeviceList } from './deviceList';
import { TestList } from './testList';
import * as api from '../api';

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

        let testsHtml = <div>No tests</div>;
        if (aggregatorData && aggregatorData.testsInfo.length) {
            testsHtml = <TestList data={aggregatorData.testsInfo} deleteCallback={this.deleteTest}/>;
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
        try {
            api.startTest(
                Number(this.selectTestElement.value),
                Number(this.selectDeviceElement.value),
            );
        } catch (err) {
            console.log(err, err.response);
        }
    }

    private deleteTest = (testId: number) => {
        const result = confirm(`Do you want to delete test with id: ${testId}?`);
        if (result) {
            try {
                api.deleteTest(testId);
            } catch (err) {
                console.log(err, err.response);
            }
        }
    }
}
