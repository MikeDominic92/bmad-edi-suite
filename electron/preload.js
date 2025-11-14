const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  getIncomingFiles: () => ipcRenderer.invoke('get-incoming-files'),
  getFolderStats: () => ipcRenderer.invoke('get-folder-stats'),

  // Investigation operations
  startInvestigation: (ticketId) => ipcRenderer.invoke('start-investigation', ticketId),
  pauseInvestigation: () => ipcRenderer.invoke('pause-investigation'),
  resumeInvestigation: () => ipcRenderer.invoke('resume-investigation'),

  // System info
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),

  // Event listeners
  onFileEvent: (callback) => {
    ipcRenderer.on('file-event', (event, data) => callback(data));
  },

  onPhaseUpdate: (callback) => {
    ipcRenderer.on('phase-update', (event, data) => callback(data));
  },

  removeFileEventListener: () => {
    ipcRenderer.removeAllListeners('file-event');
  },

  removePhaseUpdateListener: () => {
    ipcRenderer.removeAllListeners('phase-update');
  }
});
