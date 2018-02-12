/* global __dirname */
/* global process */
const electron = require('electron')
const path = require('path')
const url = require('url')
const { spawn } = require('child_process')
const menuTemplate = require('./menu')

const { app, BrowserWindow, Menu, powerSaveBlocker } = electron

powerSaveBlocker.start('prevent-display-sleep')

// Keep a reference for dev mode
let dev = true
if (process.argv.includes("--noDevServer")) {
  dev = false
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null
let prefsWindow = null

let indexPath
if (dev && process.argv.indexOf('--noDevServer') === -1) {
  indexPath = url.format({
    protocol: 'http:',
    host: 'localhost:8080',
    pathname: 'index.html',
    slashes: true,
  })
} else {
  indexPath = url.format({
    protocol: 'file:',
    pathname: path.join(__dirname, 'dist/index.html'),
    slashes: true,
  })
}

const createPrefsWindow = () => {
  prefsWindow = new BrowserWindow({ width: 500, height: 500, parent: mainWindow, alwaysOnTop: true })
  prefsWindow.loadURL('https://github.com')
  prefsWindow.show()

  prefsWindow.on('closed', () => {
    prefsWindow = null
  })
}

const createWindow = () => {
  // Get the displays and render the mirror on a secondary screen if it exists
	var displays = electron.screen.getAllDisplays()
	let externalDisplay = null
	for (var i in displays) {
		if (displays[i].bounds.x > 0 || displays[i].bounds.y > 0) {
			externalDisplay = displays[i]
			break
		}
	}

	const browserWindowOptions = {
    width: 800,
    height: 600,
    icon: 'favicon.ico',
    kiosk: !dev,
    autoHideMenuBar: true,
    darkTheme: true,
    show: false
  }
	if (externalDisplay) {
		browserWindowOptions.x = externalDisplay.bounds.x + 50
		browserWindowOptions.y = externalDisplay.bounds.y + 50
	}

  // Create the browser window.
	mainWindow = new BrowserWindow(browserWindowOptions)

	// load app's index path.
  mainWindow.loadURL( indexPath )

	// Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    // Open the DevTools automatically if developing
    if ( dev ) {
      mainWindow.webContents.openDevTools()
    }
  })

  // Emitted when the window is closed.
	mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
		mainWindow = null
  })

  // Render menus
  const menu = Menu.buildFromTemplate(menuTemplate(createPrefsWindow))
  Menu.setApplicationMenu(menu)
}

// start speech listener
var kwsProcess = spawn('node', ['./speech.js'], { detached: false })

// Handle messages from node
kwsProcess.stderr.on('data', function (data) {
  var message = data.toString()
  console.error("ERROR", message.substring(4))
})

kwsProcess.stdout.on('data', function (data) {
  var message = data.toString()
  if (message.startsWith('!h:')) {
    console.log('hotword', message.substring(4))
    mainWindow.webContents.send('hotword')
  } else if (message.startsWith('!p:')) {
    console.log('partial-results', message.substring(4))
    mainWindow.webContents.send('partial-results', message.substring(4))
  } else if (message.startsWith('!f:')) {
    console.log('final-results', message.substring(4))
    mainWindow.webContents.send('final-results', message.substring(4))
  } else {
    console.error(message.substring(3))
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

app.on('will-quit', function () {
	// clean up
})

app.on('window-all-closed', function () {
	app.quit()
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
