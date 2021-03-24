import electron from 'electron';
import { createContext, ReactNode, useEffect, useState } from 'react';

import { Port } from '../../main/helpers/SerialCommunication';

type SerialContextData = {
    portList: Port[];
    connect(port: Port): void;
    disconnect(): void;
    selectedPort: Port;
    isSerialOpen: boolean;
    refreshSerialPorts(): void;
};

type SerialProviderProps = {
    children?: ReactNode;
};

export const SerialContext = createContext({} as SerialContextData);

export const SerialProvider = ({ children }: SerialProviderProps) => {
    const [portList, setPortList] = useState<Port[]>(null);
    const [selectedPort, setSelectedPort] = useState<Port>(null);
    const [isSerialOpen, setIsSerialOpen] = useState(false);

    const ipcRenderer = electron.ipcRenderer || false;

    useEffect(() => {
        refreshSerialPorts();
        if (ipcRenderer) {
            ipcRenderer.on('serial-opened', () => {
                console.log('serial opened');
            });
        }

        return () => {
            removeSerialEvents();
        };
    }, []);

    const removeSerialEvents = () => {
        if (ipcRenderer) {
            ipcRenderer.removeAllListeners('serial-opened');
            ipcRenderer.removeAllListeners('serial-ports');
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
            }}>
            {children}
        </SerialContext.Provider>
    );
};
