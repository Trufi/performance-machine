import * as React from 'react';
import { AggregatorDeviceData } from '../../types';

const Device = (data: AggregatorDeviceData) => {
    return <ul>
        <li>Name: {data.name ? data.name : '...'}</li>
        <li>ID: {data.id}</li>
        <li>User-agent: {data.userAgent}</li>
        {data.runningTest && <ul>
            <li>Test url: {decodeURIComponent(data.runningTest.url)}</li>
            <li>start: {(new Date(data.runningTest.startTime)).toString()}</li>
            <li>name: {data.runningTest.name}</li>
        </ul>}
    </ul>;
};

export const DeviceList = ({devices}: {devices: AggregatorDeviceData[]}) => {
    return <ul>
        {devices.map((deviceData, i) => <li key={i}><Device {...deviceData}/></li>)}
    </ul>;
};
