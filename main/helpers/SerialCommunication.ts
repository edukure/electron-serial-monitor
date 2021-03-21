import { IpcMainEvent } from 'electron';
import readline from '@serialport/parser-readline';
import SerialPort from 'serialport';

interface PortData {
    port: string;
    baudRate: number;
}

interface ReceivedData extends PortData {
    timestamp: string;
    type: 'values' | 'headers';
    data: string[];
    raw: string;
}

export class SerialCommunication {
    private port: SerialPort;

    constructor() {
        this.loadPorts();
    }

    public async loadPorts(outChannel?: IpcMainEvent) {
        let ports = await SerialPort.list();

        ports = ports
            .filter((p) => p.serialNumber !== undefined)
            .map((p) => {
                const { path, serialNumber, comNumber, pnpId } = p;
                return { path, serialNumber, comNumber, pnpId };
            });

        if (outChannel) {
            outChannel.reply('serial-ports', ports);
        }
    }

    public open(data: PortData, outChannel: IpcMainEvent) {
        this.port = new SerialPort(
            data.port,
            {
                baudRate: data.baudRate,
            },
            (err) => {
                if (err) {
                    console.log('SerialPort.open error', err);
                    outChannel.reply('serial-error', err.message);
                }
            }
        );

        const parser = new readline();
        this.port.pipe(parser);

        this.port.on('open', () => {
            try {
                outChannel.reply('serial-opened', 'opened');
            } catch (err) {
                console.log('IpcMainEvent: failed to respond "serial port opened"');
            }
        });

        this.port.on('close', () => {
            try {
                outChannel.reply('serial-closed', 'closed');
            } catch (err) {
                console.log('IpcMainEvent: failed to respond "serial port closed"');
            }
        });

        let first = true;
        parser.on('data', (line: string) => {
            const outData: ReceivedData = {
                timestamp: new Date().toISOString(),
                port: data.port,
                baudRate: data.baudRate,
                type: 'values',
                data: line.split(','),
                raw: line,
            };

            if (first) {
                first = false;
                outData.type = 'headers';
                outData.data = line.split(',');
            }

            try {
                outChannel.reply('serial-data', JSON.stringify(outData));
            } catch (err) {
                console.log('IpcMainEvent: failed to respond "serial data"');
            }
        });
    }

    public async close(): Promise<void> {
        if (this.port && this.port.isOpen) {
            return new Promise((resolve, reject) => {
                this.port.close((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }
    }

    public async write(data: string) {
        if (this.port && this.port.isOpen) {
            this.port.write(data);
        }
    }

    public isOpen(): boolean {
        return this.port && this.port.isOpen;
    }
}
