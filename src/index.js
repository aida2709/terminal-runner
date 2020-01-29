const {app, BrowserWindow} = require('electron');
const path = require('path');
const fs = require('fs');
let mainWindow;
let argObject = {};
let configData = {};

function parseCliArguments(){
  let commandLineArgs = process.argv;
  let argValue;
  commandLineArgs.forEach(function (clArg) {
    argValue = clArg.split('=');
    argObject[argValue[0].substr(2)] = argValue[1];
  });
}

function getAppUrl(){
  return argObject.appUrl || configData.appUrl;
}

function getAppName() {
  return argObject.appName || configData.appName;
}

function getConfig() {
  configData = JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf-8'));
}

function getRoute(){
  var route = getAppUrl();
  var cacheBreak = Date.now();

  route += '?dc=' + cacheBreak;
  route += '&appTitle=' + getAppName();
  route += '&logLevel=' + argObject.clLogLevel || configData.clLogLevel || false;
  route += '&runnerVersion=' + configData.global.version + '&ar=nar';

  return route;
}

function createWindow () {
  parseCliArguments();
  getConfig();
  let route = getRoute();

  // Create the browser window.
  mainWindow = new BrowserWindow({
    movable: false,
    frame: false,
    fullscreen: true,
    kiosk: true,
    enableLargerThanScreen:true,
    transparent:true,
  })

  mainWindow.loadURL(route);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

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

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
