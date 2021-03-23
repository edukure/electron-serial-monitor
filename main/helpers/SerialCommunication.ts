import { IpcMainEvent } from 'electron';
import readline from '@serialport/parser-readline';
import SerialPort from 'serialport';

interface PortInfo {
    port: string;
    baudRate: number;
}

export interface ReceivedData extends PortInfo {
    timestamp: string;
    type: 'values' | 'headers';
    data: string[];
    raw: string;
}

interface Port {
    path: string;
    pnpId: string;
}

interface SerialCommunication {
    port: SerialPort;
    listPorts(): Promise<Port[]>;
    open(channel: IpcMainEvent, config: PortInfo): void;
    close(): Promise<void>;
    write(data: string): void;
    isOpen(): boolean;
    onListPorts(event: IpcMainEvent, args): void;
    onOpen(event: IpcMainEvent, args): void;
    onClose(event: IpcMainEvent, args): void;
}

export const createSerialCommunication = (): SerialCommunication => {
    let port: SerialPort = null;

    const listPorts = async (): Promise<Port[]> => {
        let ports = [];

        try {
            const rawPortsInfo = await SerialPort.list();
            ports = rawPortsInfo
                .filter((p) => p.productId !== undefined)
                .map((p) => {
                    const { path, pnpId } = p;
                    return { path, pnpId };
                });
        } catch (error) {
            console.log("Couldn't list serial ports");
        }

        return ports;
    };

    const open = (event: IpcMainEvent, config: PortInfo) => {
        port = new SerialPort(config.port, { baudRate: config.baudRate });

        const parser = new readline();
        port.pipe(parser);

        port.on('open', () => {
            try {
                event.reply('serial-opened', 'opened');
            } catch (err) {
                console.log('IpcMainEvent: failed to respond "serial port opened"');
            }
        });

        port.on('close', () => {
            try {
                event.reply('serial-closed', 'closed');
            } catch (err) {
                console.log('IpcMainEvent: failed to respond "serial port closed"');
            }
        });

        parser.on('data', (line: string) => {
            const receivedData: ReceivedData = {
                timestamp: new Date().toISOString(),
                port: config.port,
                baudRate: config.baudRate,
                type: 'values',
                data: line.split(','),
                raw: line,
            };

            try {
                event.reply('serial-data', receivedData);
            } catch (err) {
                console.log('IpcMainEvent: failed to respond "serial data"');
            }
        });
    };

    const close = async (): Promise<void> => {
        if (port && port.isOpen) {
            return new Promise((resolve, reject) => {
                port.close((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }
    };

    const write = (data: string) => {
        if (port && port.isOpen) {
            port.write(data);
        }
    };

    const isOpen = (): boolean => {
        return port && port.isOpen;
    };

    const onListPorts = async (event: IpcMainEvent, args) => {
        const ports = await listPorts();
        event.reply('serial-ports', ports);
    };

    const onOpen = async (event: IpcMainEvent, args: PortInfo) => {
        open(event, args);
        event.reply('serial-open', 'Serial opened');
    };

    const onClose = async (event: IpcMainEvent, args) => {
        close();
        event.reply('serial-closed', 'Serial closed');
    };

    return {
        port,
        open,
        onOpen,
        isOpen,
        close,
        onClose,
        listPorts,
        onListPorts,
        write,
    };
};
