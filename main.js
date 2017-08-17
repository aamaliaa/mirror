/* global __dirname */
/* global process */
const { app, BrowserWindow, powerSaveBlocker } = require('electron')
const path = require('path')
const url = require('url')

powerSaveBlocker.start('prevent-display-sleep')

// Keep a reference for dev mode
let dev = false;
if ( process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath) ) {
  dev = true;
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null

function createWindow() {
  // Get the displays and render the mirror on a secondary screen if it exists
	// var displays = electron.screen.getAllDisplays()
	var externalDisplay = null
	// for (var i in displays) {
	// 	if (displays[i].bounds.x > 0 || displays[i].bounds.y > 0) {
	// 		externalDisplay = displays[i]
	// 		break
	// 	}
	// }

	var browserWindowOptions = { width: 800, height: 600, icon: 'favicon.ico', kiosk: !dev, autoHideMenuBar: true, darkTheme: true, show: false }
	if (externalDisplay) {
		browserWindowOptions.x = externalDisplay.bounds.x + 50
		browserWindowOptions.y = externalDisplay.bounds.y + 50
	}

  // Create the browser window.
	mainWindow = new BrowserWindow(browserWindowOptions)

	// and load the index.html of the app.
  let indexPath
  if ( dev && process.argv.indexOf('--noDevServer') === -1 ) {
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
}

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
