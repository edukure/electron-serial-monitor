import { app, ipcMain, BrowserWindow, IpcMainEvent } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import { createSerialCommunication } from './helpers/SerialCommunication';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
    serve({ directory: 'app' });
} else {
    app.setPath('userData', `${app.getPath('userData')} (development)`);
}

// const serial = new SerialCommunication();
const serial = createSerialCommunication();

// ipcMain Serial Communication events
ipcMain.on('serial-connect', async (channel, args) => {
    if (serial.isOpen()) {
        await serial.close();
    }
    serial.open(channel, args);
});

ipcMain.on('serial-disconnect', () => serial.close());

ipcMain.on('serial-refresh-ports', serial.onListPorts);

// launch window when ready
(async () => {
    await app.whenReady();

    const mainWindow = createWindow('main', {
        width: 1000,
        height: 600,
    });

    if (isProd) {
        await mainWindow.loadURL('app://./home.html');
    } else {
        const port = process.argv[2];
        await mainWindow.loadURL(`http://localhost:${port}/home`);
        mainWindow.webContents.openDevTools();
    }
})();

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow('main', {
            width: 1000,
            height: 600,
        });
    }
});
