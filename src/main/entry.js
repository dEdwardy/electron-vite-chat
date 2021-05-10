const { app, BrowserWindow, ipcMain } = require('electron')
const createProtocol = require('./protocol')
const isDevelopment = process.env.CVE_ENV === 'development'

app.on('ready', () => {
  let win = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
    minWidth:940,
    minHeight:636,
    frame: false,
  })
  win.on('ready-to-show', () => {
    win.show()
  })
  ipcMain.on('min', () => win.minimize())
  ipcMain.on('max', () => {
    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  })
  ipcMain.on('close', () => win.close())
  if (isDevelopment) {
    win.loadURL(`http://localhost:${process.env.CVE_PORT}`)
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }
  win.webContents.openDevTools()
})
