import * as React from 'react';
import { AggregatorDeviceData } from '../../types';

const Device = (data: AggregatorDeviceData) => {
    return <div>
        <div>ID: {data.id}</div>
        <div>User-agent: {data.userAgent}</div>
        {data.runningTest && <ul>
            <li>Test url: {decodeURIComponent(data.runningTest.url)}</li>
            <li>start: {(new Date(data.runningTest.startTime)).toString()}</li>
            <li>name: {data.runningTest.name}</li>
        </ul>}
    </div>;
};

export const DeviceList = ({devices}: {devices: AggregatorDeviceData[]}) => {
    return <ul>
        {devices.map((deviceData, i) => <li key={i}><Device {...deviceData}/></li>)}
    </ul>;
};
