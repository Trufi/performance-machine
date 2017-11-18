import * as React from 'react';
import { AggregatorDeviceData } from '../../types';

const Device = (data: AggregatorDeviceData) => {
    return <div>
        <div>ID: {data.id}</div>
        <div>User-agent: {data.userAgent}</div>
        {data.runningTest && <div>
            <div>Test url: {data.runningTest.url} start: {data.runningTest.startTime}
                name: {data.runningTest.name}</div>
        </div>}
    </div>;
};

export const DeviceList = ({devices}: {devices: AggregatorDeviceData[]}) => {
    return <ul>
        {devices.map((deviceData, i) => <li key={i}><Device {...deviceData}/></li>)}
    </ul>;
};
