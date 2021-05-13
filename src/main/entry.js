const { app, BrowserWindow, ipcMain } = require('electron')
const createProtocol = require('./protocol')
const isDevelopment = process.env.CVE_ENV === 'development'

app.on('ready', () => {
  const GetRealSize = () => {
    //获取 DOM，之后便可以获取其宽高
    //注意，如果宽高是 100px 这种字符串，需要手动将其搞成 Number。
    let mainContent = document.getElementById('app')
    let w = mainContent.style.width
    let h = mainContent.style.height
    if (typeof w == 'string') {
      w = parseInt(w.split('px')[0])
      h = parseInt(h.split('px')[0])
    }
    return {
      width: w,
      height: h,
    }
  }
  let win = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
    minWidth: 940,
    minHeight: 636,
    frame: false,
  })
  win.openDevTools({ mode: 'right' })
  win.on('ready-to-show', () => {
    win.show()
  })
  ipcMain.addListener('resize', () => {
    const info = GetRealSize()
    console.error('resize',info)
    ipcMain.emit('resize',info)
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
