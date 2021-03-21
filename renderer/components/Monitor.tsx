import electron from 'electron';
import { useEffect, useState } from 'react';
import { Layout, Space, Select, Button, Typography } from 'antd';

import { ReceivedData } from '../../main/helpers/SerialCommunication';

interface Data {
    timestamp: string;
    value: number;
}

const SerialConnect = () => {
    const [data, setData] = useState<Data[]>([]);

    const ipcRenderer = electron.ipcRenderer || false;

    useEffect(() => {
        if (ipcRenderer) {
            if (!ipcRenderer.eventNames().includes('serial-data')) {
                ipcRenderer.on('serial-data', onDataHandler);
            }
        }

        return () => {
            removeSerialEvents();
        }
    }, []);

    const removeSerialEvents = () => {
        if(ipcRenderer) {
            ipcRenderer.removeListener("serial-data", () => {console.log("serial-data removed")});
        }
    }

    const formatData = (receivedData: ReceivedData): Data => {
        const {timestamp, data} = receivedData;

        if(!data) return;
        const value = parseFloat(data[0])

        return {
            timestamp, value
        }

    };

    const onDataHandler = (event, args) => {
        setData(data => [...data, formatData(args)]);
    }

    return (
        <Space align="center" direction="vertical">
            {data.map(d => <p key={d.timestamp}>{`${d.timestamp}: ${d.value}`}</p>)}
        </Space>
    );
};

export default SerialConnect;
