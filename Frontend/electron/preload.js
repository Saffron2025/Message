const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  onNotify: (callback) => ipcRenderer.on("notify", (_, msg) => callback(msg)),
});
