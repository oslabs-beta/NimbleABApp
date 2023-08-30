export interface IElectronAPI {
  openFile: () => Promise<any>;
  parsePaths: () => Promise<any>;
  getExperiments: () => Promise<any>;
  createModal: () => Promise<any>;
  addExperiment: (name: object) => Promise<any>;
  addVariant: (name: object) => Promise<any>;
  addRepo: (name: string) => Promise<any>;
  getVariants: (expId: number) => Promise<any>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
