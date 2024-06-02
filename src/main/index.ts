import { app, shell, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import importedIcon from "../../resources/rows.png?asset";
import { toggleWindow } from "./utils/toggleWindow";
import Store from "electron-store";

Store.initRenderer();

function createWindow(): BrowserWindow {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    show: false,
    frame: false,
    fullscreenable: false,
    movable: false,
    resizable: false,
    autoHideMenuBar: true,
    skipTaskbar: true,
    ...(process.platform === "linux" ? { icon: importedIcon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,

      // Enable using node modules in renderer.
      nodeIntegration: true,
      contextIsolation: false,

      // Ensure API polling continues after window is hidden.
      backgroundThrottling: false,
    },
    vibrancy: "fullscreen-ui",
    backgroundMaterial: "acrylic",

    alwaysOnTop: true,
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // We may want to update the icon in the future, so keeping this here for now.
  // ipcMain.on("update-icon", (_, arg) => {
  //   if (!tray.isDestroyed()) {
  //     if (arg === "TrayActive") {
  //       tray.setImage(icon);
  //     } else {
  //       tray.setImage(icon);
  //     }
  //   }
  // });

  ipcMain.on("update-title", (_, title) => {
    if (!tray.isDestroyed()) {
      tray.setTitle(title);
    }
  });

  const window = createWindow();

  window.on("blur", () => window.hide());

  const icon = nativeImage.createFromPath(importedIcon);
  const tray = new Tray(icon);
  tray.setToolTip("GitHub Notifications");

  if (process.platform == "darwin") {
    tray.setIgnoreDoubleClickEvents(true);
  }

  const contextMenu = Menu.buildFromTemplate([
    { label: "Reload", type: "normal", role: "reload" },
    { label: "Quit", type: "normal", role: "quit" },
  ]);

  tray.on("right-click", () => {
    tray.popUpContextMenu(contextMenu);
  });

  tray.on("click", () => toggleWindow(window, tray));

  // App flickers in the dock during start up but we can live with that for now.
  if (process.platform == "darwin") {
    app.dock.hide();
  }

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// No-op, we want to the app to continue running in the bg.
app.on("window-all-closed", () => {});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
