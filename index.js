const { app, BrowserWindow } = require("electron")

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 });
  win.loadURL('file:///index.html');
}

app
  .on('ready', createWindow)
  .on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
