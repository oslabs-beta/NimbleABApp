export interface IElectronAPI {
  openFile: () => Promise<any>;
  parsePaths: () => Promise<any>;
  getExperiments: () => Promise<any>;
  createModal: () => Promise<any>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
