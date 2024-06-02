import { ipcRenderer, shell } from "electron";

export function updateTrayTitle(title = ""): void {
  ipcRenderer.send("update-title", title);
}

export function openExternalLink(url: string): void {
  if (!url.toLowerCase().startsWith("file:///")) {
    shell.openExternal(url);
  }
}
