const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  openFile: () => ipcRenderer.invoke("dialog:openFile"),
  parsePaths: () => ipcRenderer.invoke("directory:parsePaths"),
  createModal: (filePath) => ipcRenderer.invoke("modal:createModal",filePath),
  addExperiment: (experiment) =>
    ipcRenderer.invoke("database:addExperiment", experiment),
  addVariant: (variant) => ipcRenderer.invoke("database:addVariant", variant),
  addRepo: (repo) => ipcRenderer.invoke("database:addRepo", repo),
  getExperiments: () => ipcRenderer.invoke("experiment:getExperiments"),
  getVariants: (experimentId) =>
    ipcRenderer.invoke("database:getVariants", experimentId),
  getRepo: (repoId) => ipcRenderer.invoke("database:getRepo", repoId),
  loadFile: (callback) => ipcRenderer.on('file-path', callback),
  saveFile: (callback)=> ipcRenderer.on('save-file', callback),
  closeFile: (value) => ipcRenderer.invoke('modal:closeModal', value)
});
