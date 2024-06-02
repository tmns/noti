import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import solid from "vite-plugin-solid";
import renderer from "vite-plugin-electron-renderer";
import solidSvg from "vite-plugin-solid-svg";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
      },
    },
    plugins: [renderer(), solid(), solidSvg()],
  },
});
