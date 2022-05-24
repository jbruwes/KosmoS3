import { app, BrowserWindow } from "electron";
import check from "electron-squirrel-startup";
import serve from "electron-serve";

if (check) app.quit();

const loadURL = serve({ directory: "." });
(async () => {
  await app.whenReady();
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
  });
  await loadURL(mainWindow);
})();
