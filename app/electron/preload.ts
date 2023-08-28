const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  parsePaths: () => ipcRenderer.invoke('directory:parsePaths'),
  getExperiments: () => ipcRenderer.invoke('experiment:getExperiments'),
});
