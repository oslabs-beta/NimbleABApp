export interface IElectronAPI {
  openFile: () => Promise<any>;
  parsePaths: () => Promise<any>;
  getExperiments: () => Promise<any>;
  createModal: () => Promise<any>;
  addExperiment: (experiment: object) => Promise<any>;
  addVariant: (name: object) => Promise<any>;
  addRepo: (repo: object) => Promise<any>;
  getVariants: (expId: number | string) => Promise<any>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
