import electron from 'electron';
import { useEffect, useState } from 'react';
import { Layout, Space, Select, Button, Typography } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Option } = Select;

import baudRates from '../../utils/baudrates';

const SerialConnect = () => {
    const [list, setList] = useState(null);
    const [selectedPort, setSelectedPort] = useState(null);
    const [selectedBaudRate, setSelectedBaudRate] = useState(null);
    const [isSerialOpen, setIsSerialOpen] = useState(false);

    const ipcRenderer = electron.ipcRenderer || false;

    useEffect(() => {
        refreshSerialPorts();
        if (ipcRenderer) {
            ipcRenderer.on('serial-opened', () => {
                console.log('serial opened');
            });
        }
    }, []);

    const refreshSerialPorts = () => {
        if (ipcRenderer) {
            if (!ipcRenderer.eventNames().includes('serial-ports')) {
                ipcRenderer.on('serial-ports', (event, args) => {
                    setList([...args]);
                });
            }

            ipcRenderer.send('serial-refresh-ports');
        }
    };

    const handleConnect = () => {
        if (ipcRenderer) {
            ipcRenderer.send('serial-connect', { port: selectedPort, baudRate: selectedBaudRate });
            setIsSerialOpen(true);
        }
    };

    const handleDisconnect = () => {
        if (ipcRenderer) {
            ipcRenderer.send('serial-disconnect');
            setIsSerialOpen(false);
        }
    };

    return (
            <Space align="center">
                <Select
                    placeholder="Serial Port Name"
                    style={{ width: '200px' }}
                    onSelect={(value) => setSelectedPort(value)}>
                    {list &&
                        list.map((port) => (
                            <Option value={port.path} key={port.serialNumber}>
                                {port.path}
                            </Option>
                        ))}
                </Select>

                <Select
                    placeholder="baud rate"
                    style={{ width: '150px' }}
                    onSelect={(value) => setSelectedBaudRate(value)}>
                    {baudRates.map((baudrate) => (
                        <Option value={baudrate} key={baudrate}>
                            {baudrate}
                        </Option>
                    ))}
                </Select>

                {isSerialOpen ? (
                    <Button type="primary" danger onClick={handleDisconnect}>
                        Disconnect
                    </Button>
                ) : (
                    <Button
                        type="primary"
                        disabled={!selectedPort || !selectedBaudRate}
                        onClick={handleConnect}>
                        Connect
                    </Button>
                )}

                <Button 
                    icon={<ReloadOutlined />}
                    onClick={refreshSerialPorts}>Refresh</Button>
            </Space>
    );
};

export default SerialConnect;
