const electron = require("electron");
const { app, BrowserWindow, Menu, ipcMain, protocol } = electron;
const path = require("path");
const isMac = process.platform === 'darwin'
let mainWindow;

global.appRoot = path.resolve(__dirname);
var isDev = process.env.APP_DEV ? (process.env.APP_DEV.trim() == "true") : false;
const autoUpdater = require(appRoot + '/auto-updater')

app.on("ready", function() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            webviewTag: false
        }
    })
    renderIndex();

    mainWindow.webContents.on('did-finish-load', () => {
        autoUpdater.init(mainWindow)
    })
});

renderIndex = async () => {
    global.version = app.getVersion();
    console.log(global.version);
    await mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.webContents.send("version", [global.version, isDev]);
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        renderIndex()
    }
})

const mainMenuTemplate = [
    {
        label: app.name,
        submenu: [
            {
                label: "Exit",
                accelerator: isMac ? "Command+Q" : "Ctrl+Q",
                role: "quit"
            }

        ]
    }
];

// Add developer tools item if not in production
if (process.env.NODE_ENV != "production"){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toogle DevTools',
                accelerator: process.platform == 'darwin' ? "Command+D" : "Ctrl+D",
                click(item,focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}


const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

Menu.setApplicationMenu(mainMenu);