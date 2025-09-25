const { app, BrowserWindow, ipcMain, Notification, Tray, Menu } = require("electron");
const path = require("path");
const io = require("socket.io-client");

let win;
let tray;

function createWindow() {
  win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (!app.isPackaged) {
    win.loadURL("http://localhost:5173"); // Dev mode
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html")); // Build mode
  }

  // ❌ Prevent app from quitting when window is closed
  win.on("close", (event) => {
    event.preventDefault();
    win.hide(); // Hide instead of closing
  });
}

function setupTray() {
  tray = new Tray(path.join(__dirname, "../build/icon.png"));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show App",
      click: () => {
        if (win) win.show();
      },
    },
    {
      label: "Quit",
      click: () => {
        app.quit();
      },
    },
  ]);
  tray.setToolTip("📩 MessageApp Running");
  tray.setContextMenu(contextMenu);
}

function setupSocket() {
  const socket = io("https://message-backend-dn9x.onrender.com"); // ✅ deployed backend

  socket.on("connect", () => {
    console.log("✅ Connected to backend socket");
  });

  socket.on("notification", (msg) => {
    // System notification
    new Notification({
      title: "📢 New Message",
      body: msg,
      icon: path.join(__dirname, "../build/icon.png"),
    }).show();

    // React app ko bhi bhejo
    if (win) {
      win.webContents.send("new-message", msg);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected from backend");
  });
}

app.whenReady().then(() => {
  createWindow();
  setupSocket();
  setupTray();
});

ipcMain.on("show-notification", (event, { title, body }) => {
  new Notification({ title, body }).show();
});

app.on("window-all-closed", () => {
  // Mac users ke liye background me rakho
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
