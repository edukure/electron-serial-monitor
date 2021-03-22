import electron from 'electron';
import { useEffect, useState } from 'react';
import { List, Input, Button } from 'antd';

import { ReceivedData } from '../../main/helpers/SerialCommunication';

interface Data {
    timestamp: string;
    value: number;
}

const Monitor = () => {
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
        };
    }, []);

    const removeSerialEvents = () => {
        if (ipcRenderer) {
            ipcRenderer.removeListener('serial-data', () => {
                console.log('serial-data removed');
            });
        }
    };

    const formatData = (receivedData: ReceivedData): Data => {
        const { timestamp, data } = receivedData;

        if (!data) return;
        const value = parseFloat(data[0]);

        const formatedTimestamp = timestamp.substring(11, 23);

        return {
            timestamp: formatedTimestamp,
            value,
        };
    };

    const onDataHandler = (event, args) => {
        setData((data) => [...data, formatData(args)]);
        var element = document.getElementById('scroll');
        element.scrollTop = element.scrollHeight - element.clientHeight;
    };

    return (
        <div
            style={{
                paddingBottom: '50px',
                height: '100%',
                background: 'white',
                border: '1px solid lightgray',
                borderRadius: '2px',
            }}>
            <div style={{ height: '50px', background: 'white', display: "flex", padding: "10px 10px 0px 10px"}}>
                <Input style={{flexGrow: 1, marginRight: "5px"}} placeholder="Write to serial" />
                <Button style={{height: "40px", width: "100px", flexGrow: 1}} type="primary">Send</Button>
            </div>
            <List
                id="scroll"
                style={{ maxHeight: '100%', overflow: 'auto' }}
                size="small"
                dataSource={data}
                renderItem={(item) => <List.Item>{`${item.timestamp}: ${item.value}`}</List.Item>}
            />
        </div>
    );
};

export default Monitor;
