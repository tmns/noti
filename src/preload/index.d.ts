import { ElectronAPI } from "@electron-toolkit/preload";
import { Shell } from "electron";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: unknown;
    shell: Shell;
  }
}
