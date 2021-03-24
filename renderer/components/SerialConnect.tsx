import { useContext, useState } from 'react';
import { Space, Select, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const { Option } = Select;

import baudRates from '../../utils/baudrates';
import { SerialContext } from '../context/SerialContext';

const SerialConnect = () => {
    const [portName, setPortName] = useState('');
    const [baudRate, setBaudRate] = useState(9600);
    const [pnpId, setPnpId] = useState('');

    const { portList, connect, disconnect, isSerialOpen, refreshSerialPorts } = useContext(SerialContext);

    const handlePortChange = (value, option) => {
        setPortName(value);
        setPnpId(option.key);
    };

    const handleBaudRateChange = (value) => {
        setBaudRate(value);
    };

    const handleConnect = () => {
        const port = {
            path: portName,
            baudRate,
            pnpId,
        };

        connect(port);
    };

    return (
        <Space align="center">
            <Select placeholder="Serial Port Name" style={{ width: '200px' }} onSelect={handlePortChange}>
                {portList &&
                    portList.map((port) => (
                        <Option value={port.path} key={port.pnpId}>
                            {port.path}
                        </Option>
                    ))}
            </Select>

            <Select
                placeholder="baud rate"
                style={{ width: '150px' }}
                onSelect={handleBaudRateChange}
                defaultValue={baudRate}>
                {baudRates.map((baudrate) => (
                    <Option value={baudrate} key={baudrate}>
                        {baudrate}
                    </Option>
                ))}
            </Select>

            {isSerialOpen ? (
                <Button type="primary" danger onClick={disconnect}>
                    Disconnect
                </Button>
            ) : (
                <Button type="primary" disabled={!portName || !baudRate} onClick={handleConnect}>
                    Connect
                </Button>
            )}

            <Button icon={<ReloadOutlined />} onClick={refreshSerialPorts}>
                Refresh
            </Button>
        </Space>
    );
};

export default SerialConnect;
