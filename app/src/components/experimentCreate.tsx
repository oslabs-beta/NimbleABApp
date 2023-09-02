import React, { useEffect, useState } from 'react';
import { IElectronAPI } from '../../../renderer';
import { Navigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import SelectPath from './selectPath';

const ExperimentCreate = (): React.JSX.Element => {
  //Determine if navigate
  const [configPage, setConfigPage] = useState(false);
  //Opened Directory
  const [filePath, setFilePath] = useState('');
  //Makes sure Directory is opened
  const [allowSelect, setAllowSelect] = useState(true);
  //All available paths to run experiment on
  const [dirPaths, setDirPaths] = useState([]);
  //Name of experiment
  const [experimentName, setExperimentName] = useState('');
  //Path Experiment will run on
  const [experimentPath, setExperimentPath] = useState('');
  //The experiment ID
  const [experimentId, setExperimentId] = useState(uuidv4());
  //The Repo ID
  const [repoId, setRepoId] = useState('');

  async function handleCreateExperiment(): Promise<void> {
    //Add Repo and Add Experiment
    const repo_data = await window.electronAPI.addRepo({
      FilePath: filePath,
    });
    const { id } = repo_data;
    setRepoId(id);
    const data = await window.electronAPI.addExperiment({
      Experiment_name: experimentName,
      Device_Type: 'desktop',
      Repo_id: id,
      experiment_path: experimentPath,
      experiment_uuid: experimentId,
      directory_path: filePath,
    });
    console.log('end of new experiment post');
    setConfigPage(true);
  }

  async function handleClick() {
    const basename = await window.electronAPI.openFile();
    console.log(basename);
    setFilePath(basename);
    const paths = await window.electronAPI.parsePaths();
    setDirPaths(paths);
    setAllowSelect(false);
  }

  function handleNameChange(name: string): void {
    setExperimentName(name);
  }

  return (
    <div className="rounded-xl w-1/2 h-96 bg-slate-800 text-white p-2 flex flex-col items-center font-mono">
      <h1 className="text-lg mb-4">Create Experiment</h1>
      <input
        className="w-96 border rounded-md p-4 text-black"
        type="text"
        onChange={(e) => handleNameChange(e.target.value)}
        placeholder="Experiment Name"
      ></input>
      <div className="flex mt-4 gap-10 mb-4 pr-2 border w-96 rounded-md ">
        <button onClick={handleClick} className="btn btn-secondary">
          Open Directory
        </button>
        <div className="flex growplace-content-center">
          <p className="self-center">{filePath}</p>
        </div>
      </div>
      <SelectPath
        dirPaths={dirPaths}
        setExperimentPath={setExperimentPath}
        disabled={allowSelect}
      ></SelectPath>
      <button
        onClick={handleCreateExperiment}
        className="btn btn-secondary mt-4"
      >
        Create Experiment
      </button>
      {configPage && (
        <Navigate
          to="/config"
          state={{
            experimentPath,
            experimentId,
            repoId,
            experimentName,
          }}
          replace={true}
        />
      )}
    </div>
  );
};

export default ExperimentCreate;
