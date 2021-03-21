import electron from 'electron';
import { useEffect, useState } from 'react';
import { Space, List, Affix} from 'antd';

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

        const formatedTimestamp = timestamp.substring(11,23);

        return {
            timestamp: formatedTimestamp, value
        }

    };

    const onDataHandler = (event, args) => {
        setData(data => [...data, formatData(args)]);
        var element = document.getElementById("scroll");
        element.scrollTop = element.scrollHeight - element.clientHeight;
    }

    

    

    return (
        <div id="scroll" style={{overflow: "auto", maxHeight:"100%"}}>
            <List style={{height:"100%"}} size="small" bordered dataSource={data}  renderItem={item => <List.Item>{`${item.timestamp}: ${item.value}`}</List.Item>}/>
        </div>
    );
};

export default Monitor;
