const electron = require('electron')
const { app } = electron;
const { autoUpdater } = require("electron-updater")


const appVersion = app.getVersion();

let initialized = false
var isDev = process.env.APP_DEV ? (process.env.APP_DEV.trim() == "true") : false;

function init(mainWindow) {
    mainWindow.webContents.send('updater-message', { msg: `🖥 App version: ${appVersion}` })
    if (initialized || isDev) { return }

    initialized = true
    console.log('initialized AutoUpdater');

    autoUpdater.on('error', (ev, err) => {
        mainWindow.webContents.send('updater-message', { msg: `😱 Error: ${err}` })
    })

    autoUpdater.once('checking-for-update', (ev, err) => {
        console.log('checking for updates');
        mainWindow.webContents.send('updater-message', { msg: '🔎 Checking for updates' })
    })

    autoUpdater.once('update-available', (ev, err) => {
        mainWindow.webContents.send('updater-message', { msg: '🎉 Update available. Downloading ⌛️', hide: false })
    })

    autoUpdater.once('update-not-available', (ev, err) => {
        mainWindow.webContents.send('updater-message', { msg: '👎 Update not available' })
    })

    autoUpdater.once('update-downloaded', (ev, err) => {
        const msg = '<p style="margin: 0;">🤘 Update downloaded - <a onclick="quitAndInstall()">Restart</a></p>'
        mainWindow.webContents.send('updater-message', { msg, hide: false, replaceAll: true })
    })

    autoUpdater.checkForUpdates()
}

module.exports = {
    init
}
