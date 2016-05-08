const electron = require('electron')
const ipc = electron.ipcMain
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let PageWin
let Page_ses

var atomScreen
var ws_size

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: ws_size.width / 2, height: ws_size.height, x: ws_size.width * 2 / 3, y: 0, darkTheme: true})
  PageWin = new BrowserWindow({width: ws_size.width / 2, height: ws_size.height, x: 0, y: 0, darkTheme: true})
  Page_ses = PageWin.webContents.session

  mainWindow.loadURL('file://' + __dirname + '/tab-navigation/index.html')
  mainWindow.webContents.openDevTools()

  // PageWin.loadURL('http://moodle.ntust.edu.tw')
  PageWin.loadURL('https://google.com.tw')
  PageWin.webContents.on('did-start-loading', function () {
    PageWin.webContents.executeJavaScript(`
      var window.$ = window.jQuery = require('./jquery-2.2.3.min.js')
      `)
  })
  PageWin.webContents.on('did-finish-load', function () {
    PageWin.webContents.executeJavaScript(`
      const ipc = require('electron').ipcRenderer
      var active_history = []

      document.addEventListener("mouseup", function () {
        var ele = document.activeElement
        active_history.push(ele)
        console.log(ele)
        ipc.send('asynchronous-message', {'url': document.URL, 'tagName': ele.tagName, 'class': ele.className, 'id': ele.id})
      })

      var body = document.getElementsByTagName('BODY')[0]
      var goback = document.createElement('button')
      var goback_text = document.createTextNode('GoBack')
      goback.appendChild(goback_text)
      goback.setAttribute('style', \`
        position:fixed;
        right:50px;
        bottom:50px;
        background-color:#44c767;
      	-moz-border-radius:20px;
      	-webkit-border-radius:20px;
      	border-radius:20px;
      	border:1px solid #18ab29;
      	display:inline-block;
      	cursor:pointer;
      	color:#ffffff;
      	font-family:Arial;
      	font-size:14px;
      	padding:14px 25px;
      	text-decoration:none;
      	text-shadow:0px 1px 0px #2f6627;
        \`)

      goback.addEventListener('click', function () {
        ipc.send('webpage-goback', true)
      })
      body.appendChild(goback)
      `)
  })

  PageWin.openDevTools()
  PageWin.webContents.send('update-crawler-task', {})

  Page_ses.webRequest.onBeforeSendHeaders({}, (details, callback) => {
    callback({cancel: false, requestHeaders: details.requestHeaders})
    if (details.method === 'POST') { console.log(details) }
  })

  PageWin.on('closed', function () {
    PageWin = null
  })

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', function () {
  atomScreen = require('screen')
  ws_size = atomScreen.getPrimaryDisplay().workAreaSize
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

ipc.on('asynchronous-message', function (event, arg) {
  console.log(arg)
  mainWindow.webContents.send('on-foucs', arg)
})

ipc.on('webpage-goback', function (event, arg) {
  PageWin.webContents.goBack()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
