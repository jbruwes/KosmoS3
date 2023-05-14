import { app, BrowserWindow, Menu } from "electron";
import check from "electron-squirrel-startup";
import serve from "electron-serve";

if (check) app.quit();
const loadURL = serve({ directory: "." });
(async () => {
  await app.whenReady();
  Menu.setApplicationMenu(
    Menu.buildFromTemplate(
      Menu.getApplicationMenu().items.filter(
        (item) => !["viewmenu", "help"].includes(item.role)
      )
    )
  );
  loadURL(
    new BrowserWindow({
      width: 1024,
      height: 768,
      webPreferences: {
        devTools: false,
      },
    })
  );
})();
