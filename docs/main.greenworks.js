const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const picoDeployConfig = require('./picoDeployConfig.json');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Get Dis Money"
  });

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'www/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  if(process.env.DEV) {
    win.webContents.openDevTools();
  }

  // Check for Steam Builds
  if(picoDeployConfig.steam) {

    // Copy our steam_appid to the correct place if we have one, and doesn't already exist
    // This is only for electron-builder builds, where steam_appid is placed in Resources/
    try {
      const steamAppIdProjectPath = `${process.resourcesPath}/steam_appid.txt`;
      let steamAppIdExePath = `${path.dirname(app.getPath('exe'))}/steam_appid.txt`;
      if (fs.existsSync(steamAppIdProjectPath) && !fs.existsSync(steamAppIdExePath)) {
        fs.writeFileSync(steamAppIdExePath, fs.readFileSync(steamAppIdProjectPath));
      }
    } catch(e) {
      console.log('Problem occured while trying to copy over your steam_appid: ', e);
    }

    // Initialize greenworks
    let greenworks;
    if (process.env.DEV) {
      greenworks = require(`./greenworks/greenworks.js`);
    } else {
      greenworks = require(`${process.resourcesPath}/greenworks/greenworks.js`);
    }

    // Using Init API vs. init, as init was returning false incorrectly
    if (greenworks.initAPI()) {
      console.log('Greenworks: Steam API has been initalized.');
      // Attatch greenworks to the window
      //https://github.com/electron/electron/issues/1095
      win.greenworks = greenworks;

      // Try to get the steam overlay working
      // --in-process-gpu
      var os = require('os');
      if (os.platform() === 'win32' && parseInt(os.release().split('.')[0]) >= 8) {
        app.commandLine.appendSwitch('in-process-gpu')
      }

      // Canvas hack
      // https://github.com/greenheartgames/greenworks/wiki/Troubleshooting#steam-overlay-is-unresponsive--frozen
      // https://stackoverflow.com/questions/38962385/how-can-i-access-dom-element-via-electron
      win.webContents.executeJavaScript(`

        console.log('Greenworks: Starting Greenworks canvas hack...');

        function forceRefresh() {
            var canvas = document.getElementById("forceRefreshCanvas");
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            window.requestAnimationFrame(forceRefresh);
        }

        const forceRefreshCanvas = document.createElement('canvas');
        forceRefreshCanvas.id = 'forceRefreshCanvas';
        forceRefreshCanvas.width = 1;
        forceRefreshCanvas.height = 1;
        document.body.appendChild(forceRefreshCanvas);

        forceRefresh();
      `);
    } else {
      console.log('Greenworks: Could not start greenworks');
    }
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
