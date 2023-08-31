import React, { useEffect, useState } from "react";
import { IElectronAPI } from "../../../renderer";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

import SelectPath from "./selectPath";
const ExperimentCreate = (): React.JSX.Element => {
  //Opened Directory
  const [filePath, setFilePath] = useState("");
  //Makes sure Directory is opened
  const [allowSelect, setAllowSelect] = useState(true);
  //All available paths to run experiment on
  const [dirPaths, setDirPaths] = useState([]);
  //Name of experiment
  const [experimentName, setExperimentName] = useState("");
  //Path Experiment will run on
  const [experimentPath, setExperimentPath] = useState("");
  //The experiment ID
  const [experimentId, setExperimentId] = useState(uuidv4());

  async function handleCreateExperiment(): Promise<void> {
    //Add Repo and Add Experiment
    // const { experimentId, experiment_name, experiment_path, device_type } =
    const response = await axios.post(
      "https://nimblebackend-te9u.onrender.com/createExperiment",
      {
        experimentId: experimentId,
        experiment_name: experimentName,
        experiment_path: experimentPath,
        device_type: "desktop",
      },
      {
        withCredentials: false,
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
          // "Access-Control-Allow-Methods":
          //   "GET, POST, PATCH, PUT, DELETE, OPTIONS",
          // "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
        },
      }
    );
    console.log(response.status);
    console.log("end of new experiment post");
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
        <Link
          to="/config"
          state={{ directoryPath: filePath, experimentPath, experimentId }}
        >
          Create Experiment
        </Link>
      </button>
    </div>
  );
};

export default ExperimentCreate;
