import React, { useEffect, useState } from 'react';
import { IElectronAPI } from '../../../renderer';
import ExperimentComponent from './experiment';

const activeExperiment = (): React.JSX.Element => {
  const [experiments, setExperiments] = useState([]);

  const getExperiments = async (): Promise<any> => {
    const data = await window.electronAPI.getExperiments();
    await setExperiments(data);
  };
  useEffect(() => {
    console.log('running');
    getExperiments();
  }, []);

  return (
    <div className="rounded-xl w-1/2 h-96 bg-slate-800 text-white p-2 flex flex-col items-center ">
      <h1 className="text-lg">Active Experiment</h1>
      <div className="divider before:bg-gray-500 after:bg-gray-500 w-full self-center"></div>
      <div className="flex mt-4 gap-10 mb-4 pr-2  w-96 rounded-md ">
        {/* <button className="btn btn-primary">Open Directory</button> */}
        {/* <p>Hello</p> */}
        {experiments}
        <div className="flex growplace-content-center">
          <p className="self-center"></p>
        </div>
      </div>
      {/* <SelectPath dirPaths={dirPaths} disabled={allowSelect}></SelectPath> */}
    </div>
  );
};

export default activeExperiment;
