const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
require('dotenv').config();

const { InvestigationEngine } = require('./backend/investigation-engine');
const { FileSystemManager } = require('./backend/file-system-manager');

let mainWindow;
let investigationEngine;
let fileSystemManager;

// Initialize backend services
async function initializeBackend() {
  try {
    // Initialize investigation engine with Claude SDK
    investigationEngine = new InvestigationEngine({
      apiKey: process.env.ANTHROPIC_API_KEY,
      notebookUrl: process.env.NOTEBOOKLM_NOTEBOOK_URL
    });
    await investigationEngine.initialize();

    // Initialize file system manager
    fileSystemManager = new FileSystemManager(process.env.TICKETS_BASE_PATH);

    // Start watching incoming folder
    fileSystemManager.watchIncoming((event) => {
      if (mainWindow) {
        mainWindow.webContents.send('file-event', event);
      }
    });

    console.log('[BMAD-EDI] Backend initialized successfully');
  } catch (error) {
    console.error('[BMAD-EDI] Backend initialization error:', error);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: 'BMAD-EDI Investigation Suite',
    icon: path.join(__dirname, '../public/icon.png')
  });

  // Load React app
  const startURL = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startURL);

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(async () => {
  await initializeBackend();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (investigationEngine) {
    investigationEngine.cleanup();
  }
  if (fileSystemManager) {
    fileSystemManager.stopWatching();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('get-incoming-files', async () => {
  try {
    const files = await fileSystemManager.getIncomingFiles();
    return { success: true, files };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-folder-stats', async () => {
  try {
    const stats = await fileSystemManager.getFolderStats();
    return { success: true, stats };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('start-investigation', async (event, ticketId) => {
  try {
    const result = await investigationEngine.executeInvestigation(ticketId);
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('pause-investigation', async () => {
  try {
    investigationEngine.pause();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('resume-investigation', async () => {
  try {
    investigationEngine.resume();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-system-info', async () => {
  return {
    platform: process.platform,
    version: app.getVersion(),
    ticketsPath: process.env.TICKETS_BASE_PATH,
    apiConfigured: !!process.env.ANTHROPIC_API_KEY
  };
});
