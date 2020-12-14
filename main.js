// Modules to control application life and create native browser window
const {app, BrowserWindow, Tray, Menu} = require('electron');
const path = require('path');

if (handleSquirrelEvent()) {
    return;
}

let appIcon = null

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 350,
    x:1600,
    y:740,
    alwaysOnTop:true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    frame: false,          // 標題列不顯示
    transparent: true,     // 背景透明
    autoHideMenuBar: true, // 工具列不顯示
    skipTaskbar: true,     // 不顯示在下方工作列
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');
  mainWindow.setIgnoreMouseEvents(true);
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  createTray(mainWindow);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
    
function createTray(mainWindow) {
    const iconPath = path.join(__dirname,'cat.ico')

    const contextMenu = Menu.buildFromTemplate([{
            label: '顯示貓貓',
            click() {
                mainWindow.show()
            }
        },
        {
          label: '隱藏貓貓',
            click() {
                mainWindow.hide()
            }
        },
        {
            label: '關閉貓貓',
            click() {
                mainWindow.removeAllListeners('close')
                mainWindow.close()
            }
        }
    ]);

    appIcon = new Tray(iconPath)
    appIcon.setToolTip('可愛貓貓')
    appIcon.setContextMenu(contextMenu)
}

function handleSquirrelEvent() {
    if (process.argv.length === 1) {
        return false;
    }

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function (command, args) {
        let spawnedProcess;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true
            });
        } catch (error) {}

        return spawnedProcess;
    };

    const spawnUpdate = function (args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            spawnUpdate(['--createShortcut', exeName]);
            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-uninstall':

            spawnUpdate(['--removeShortcut', exeName]);
            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            app.quit();
            return true;
    }
}
