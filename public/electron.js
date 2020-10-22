const { app, BrowserWindow } = require("electron");
const path = require('path');
const url = require('url');
const isDev = require("electron-is-dev");
var Datastore = require("nedb");

function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        },
    });

    // and load the index.html of the app.
    // win.loadURL(
    //     isDev
    //         ? "http://localhost:3000"
    //         // : `${path.join(__dirname, './public/index.html')}`
    //         : `file://${__dirname}/build/index.html`
    // );

    win.loadURL(
        isDev
            ? "http://localhost:3000"
            : `file://${path.join(__dirname, '../build/index.html')}`
    );

    // win.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, './build/index.html')}`);
    // win.loadURL(`file://${path.join(__dirname, './build/index.html')}`) // Not allowed to load local resource: file:///Users/shenhongyu/Projects/HCI%20lab/config-gen/dist/mac/config-gen.app/Contents/Resources/app.asar/build/index.html
    // win.loadURL(url.format({
    //     pathname: path.join(__dirname, './build/index.html'),
    //     protocol: 'file:',
    //     slashes: true
    //   }));
    console.log(`file://${path.join(__dirname, './build/index.html')}`)
    console.log(url.format({
        pathname: path.join(__dirname, '/build/index.html'),
        protocol: 'file:',
        slashes: true
      }))
    // if (isDev) {
    //     win.loadURL("http://localhost:3000");
    // } else {
    //     win.loadFile(`${path.join(__dirname, './build/index.html')}`);
    // }

    // Open the DevTools.
    // if (isDev) {
    //     win.webContents.openDevTools();
    // }
    win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
var userData = app.getPath('userData');
// console.log(userData);
// console.log(path.join(userData, "/db/form_config.db"))
exports.formConfig = new Datastore({
    filename: path.join(userData, "/db/form_config.db"),
    autoload: true,
});
exports.scenes = new Datastore({
    filename: path.join(userData, "/db/scenes.db"),
    autoload: true,
});
