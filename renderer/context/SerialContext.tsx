import electron from 'electron';
import { createContext, ReactNode, useEffect, useState } from 'react';

import { Port, Data, ReceivedData } from '../../main/helpers/SerialCommunication';

type SerialContextData = {
    portList: Port[];
    connect(port: Port): void;
    disconnect(): void;
    selectedPort: Port;
    isSerialOpen: boolean;
    refreshSerialPorts(): void;
    data: Data[];
    setIsPlotterOpen(value: boolean);
};

type SerialProviderProps = {
    children?: ReactNode;
};

export const SerialContext = createContext({} as SerialContextData);

export const SerialProvider = ({ children }: SerialProviderProps) => {
    const [portList, setPortList] = useState<Port[]>(null);
    const [selectedPort, setSelectedPort] = useState<Port>(null);
    const [isSerialOpen, setIsSerialOpen] = useState(false);
    const [data, setData] = useState<Data[]>([]);
    const [isPlotterOpen, setIsPlotterOpen] = useState(false);

    const ipcRenderer = electron.ipcRenderer || false;

    useEffect(() => {
        refreshSerialPorts();
        if (ipcRenderer) {
            ipcRenderer.on('serial-opened', () => {
                console.log('serial opened');
            });

            if (!ipcRenderer.eventNames().includes('serial-data')) {
                ipcRenderer.on('serial-data', onData);
            }
        }

        return () => {
            removeSerialEvents();
        };
    }, []);


    useEffect(() => {
        if (isPlotterOpen && ipcRenderer) {
            ipcRenderer.send('send-to-plotter', data);
        }
    }, [data]);

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

    const onData = (event, args) => {
        setData((data) => [...data, formatData(args)]);
    };

    const removeSerialEvents = () => {
        if (ipcRenderer) {
            ipcRenderer.removeAllListeners('serial-opened');
            ipcRenderer.removeAllListeners('serial-ports');
            ipcRenderer.removeAllListeners('serial-data');
            ipcRenderer.send('serial-disconnect');
        }
    };

    const refreshSerialPorts = () => {
        if (ipcRenderer) {
            if (!ipcRenderer.eventNames().includes('serial-ports')) {
                ipcRenderer.on('serial-ports', (event, args) => {
                    setPortList([...args]);
                });
            }

            ipcRenderer.send('serial-refresh-ports');
        }
    };

    const connect = (port: Port) => {
        if (ipcRenderer) {
            ipcRenderer.send('serial-connect', port);
            setIsSerialOpen(true);
            setSelectedPort(port);
        }
    };

    const disconnect = () => {
        if (ipcRenderer) {
            ipcRenderer.send('serial-disconnect');
            setIsSerialOpen(false);
        }
    };

    return (
        <SerialContext.Provider
            value={{
                portList,
                connect,
                disconnect,
                selectedPort,
                isSerialOpen,
                refreshSerialPorts,
                data,
                setIsPlotterOpen
            }}>
            {children}
        </SerialContext.Provider>
    );
};
