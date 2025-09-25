const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  showNotification: (title, body) => {
    ipcRenderer.send("show-notification", { title, body });
  },
  onMessage: (callback) => {
    ipcRenderer.on("new-message", (_, msg) => callback(msg));
  }
});
