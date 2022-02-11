const { app, BrowserWindow } = require("electron");
const serve = require("electron-serve");

const loadURL = serve({ directory: "." });
(async () => {
  await app.whenReady();
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
  });
  await loadURL(mainWindow);
})();
