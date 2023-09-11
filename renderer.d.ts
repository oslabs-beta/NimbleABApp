export interface IElectronAPI {
  openFile: () => Promise<any>;
  parsePaths: () => Promise<any>;
  getExperiments: () => Promise<any>;
  createModal: (value: any) => Promise<any>;
  addExperiment: (experiment: object) => Promise<any>;
  addVariant: (name: object) => Promise<any>;
  addRepo: (repo: object) => Promise<any>;
  getVariants: (expId: number | string) => Promise<any>;
  getRepo: (repoId: any) => Promise<any>;
  loadFile: (callback: any) => Promise<any>;
  saveFile: (callback: any) => Promise<any>;
  closeFile: (value: any) => Promise<any>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
