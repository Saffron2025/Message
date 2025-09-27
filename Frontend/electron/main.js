const { app, BrowserWindow, ipcMain, Notification, Tray, Menu, shell } = require("electron");
const path = require("path");
const io = require("socket.io-client");

let win;
let tray;

// ✅ Create Main Window
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

  // ❌ Prevent app from quitting when closed
  win.on("close", (event) => {
    event.preventDefault();
    win.hide(); // Hide instead of quit
  });
}

// ✅ System Tray Setup
function setupTray() {
  tray = new Tray(path.join(__dirname, "../build/icon.ico")); // tray icon
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

// ✅ Socket.IO Connection
function setupSocket() {
  const socket = io("https://message-backend-dn9x.onrender.com"); // deployed backend

  socket.on("connect", () => {
    console.log("✅ Connected to backend socket");
  });

  // 🔔 Listen for notifications
  socket.on("notification", (msg) => {
    const notification = new Notification({
      title: "📢 New Message",
      body: msg,
      icon: path.join(__dirname, "../build/icon.ico"),
    });

    notification.show();

    // Example: notification click opens link (optional)
    notification.on("click", () => {
      shell.openExternal("https://your-link.com"); // 👈 Replace with your link
    });

    // Forward to React app also
    if (win) {
      win.webContents.send("new-message", msg);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected from backend");
  });
}

// ✅ App Ready
app.whenReady().then(() => {
  createWindow();
  setupSocket();
  setupTray();
});

// ✅ IPC for manual notifications
ipcMain.on("show-notification", (event, { title, body }) => {
  new Notification({
    title,
    body,
    icon: path.join(__dirname, "../build/icon.ico"),
  }).show();
});

// ✅ Keep running in background
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
