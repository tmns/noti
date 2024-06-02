import { BrowserWindow, Tray } from "electron";

export function toggleWindow(window: BrowserWindow, tray: Tray): void {
  if (window.isVisible()) {
    window.hide();
  } else {
    showMainWindow(window, tray);
  }
}

function showMainWindow(window: BrowserWindow, tray: Tray): void {
  const position = getWindowPosition(window, tray);
  window.setPosition(position.x, position.y);
  window.show();
  window.focus();
}

function getWindowPosition(window: BrowserWindow, tray: Tray) {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();

  let x = 0;
  let y = 0;

  // MacOS
  if (process.platform != "win32") {
    // Center window horizontally below the tray icon
    x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2);
    // Position window 4 pixels vertically below the tray icon
    y = Math.round(trayBounds.y + trayBounds.height + 4);

    return { x: x, y: y };
  }

  // On Windows the Task bar is sadly very flexible.
  if (trayBounds.y < 250) {
    x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2);
    y = Math.round(trayBounds.y + trayBounds.height + 4);
  } else if (trayBounds.x < 250) {
    x = Math.round(trayBounds.x + trayBounds.height * 2);
    y = Math.round(trayBounds.y - windowBounds.height + trayBounds.height);
  } else if (trayBounds.height >= 40) {
    x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2);
    y = Math.round(trayBounds.y - windowBounds.height);
  } else {
    x = Math.round(trayBounds.x - windowBounds.width);
    y = Math.round(trayBounds.y - windowBounds.height + trayBounds.height);
  }

  return { x: x, y: y };
}
