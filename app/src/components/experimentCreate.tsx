import React, { useEffect, useState } from 'react';
import { IElectronAPI } from '../../../renderer';

import SelectPath from './selectPath';
const ExperimentCreate = (): React.JSX.Element => {
  //Change to redux at some point
  const [filePath, setFilePath] = useState('');
  const [allowSelect, setAllowSelect] = useState(true);
  const [dirPaths, setDirPaths] = useState([]);

  async function handleClick() {
    const basename = await window.electronAPI.openFile();
    console.log(basename);
    setFilePath(basename);
    const paths = await window.electronAPI.parsePaths();
    setDirPaths(paths);
    setAllowSelect(false);
  }
  return (
    <div className="rounded-xl w-1/2 h-96 bg-slate-800 text-white p-2 flex flex-col items-center ">
      <h1 className="text-lg">Create Experiment</h1>
      <div className="flex mt-4 gap-10 mb-4 pr-2 border w-96 rounded-md ">
        <button onClick={handleClick} className="btn btn-primary">
          Open Directory
        </button>
        <div className="flex growplace-content-center">
          <p className="self-center">{filePath}</p>
        </div>
      </div>
      <SelectPath dirPaths={dirPaths} disabled={allowSelect}></SelectPath>
    </div>
  );
};

export default ExperimentCreate;
