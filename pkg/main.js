import { app, BrowserWindow } from "electron";
import serve from "electron-serve";

const loadURL = serve({ directory: "." });
(async () => {
  await app.whenReady();
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
  });
  await loadURL(mainWindow);
})();
