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
  tray.setToolTip("📩 Defend Me Pro Running");
  tray.setContextMenu(contextMenu);
}

// ✅ Socket.IO Connection
function setupSocket() {
  const socket = io("https://message-backend-dn9x.onrender.com");

  socket.on("connect", () => {
    console.log("✅ Connected to backend socket");
  });

  // 🔔 Listen for notifications
  socket.on("notification", (msg) => {
    let data;

    try {
      // Agar backend se JSON string aaya hai
      data = typeof msg === "string" ? JSON.parse(msg) : msg;
    } catch (err) {
      // Agar normal string aaya hai
      data = { body: msg };
    }

    const notification = new Notification({
      title: data.title || "📢 Defend Me Pro",
      body: data.body || "",
      icon: data.icon
        ? data.icon // ⚠️ Local icon better (remote kabhi fail hota hai)
        : path.join(__dirname, "../build/icon.ico"),
    });

    notification.show();

    // 👇 URL click
    if (data.url) {
      notification.on("click", () => {
        shell.openExternal(data.url);
      });
    }

    // React app ko bhi bhejna
    if (win) {
      win.webContents.send("new-message", data);
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
