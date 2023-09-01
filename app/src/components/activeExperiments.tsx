import React, { useEffect, useState } from 'react';
import { IElectronAPI } from '../../../renderer';
import ExperimentComponent from './experiment';

const activeExperiment = (): React.JSX.Element => {
  const [experiments, setExperiments] = useState([]);
  const [receivedExperiments, setReceivedExperiments] = useState(false);
  const getExperiments = async (): Promise<void> => {
    //Gets All experiments from DB
    const data = await window.electronAPI.getExperiments();
    await setExperiments(JSON.parse(data));
  };
  useEffect(() => {
    console.log('running');
    getExperiments();
    setReceivedExperiments(true);
  }, []);
  let expComp: any = experiments.map((el) => <ExperimentComponent data={el} />);

  return (
    <div className="rounded-xl w-1/2 h-96 bg-slate-800 text-white p-2 flex flex-col items-center ">
      <h1 className="text-lg">Active Experiment</h1>
      <div className="divider before:bg-gray-500 after:bg-gray-500 w-full self-center"></div>
      <div className="flex overflow-hidden flex-col gap-10 mt-4  mb-4 pr-2  w-96 rounded-md ">
        {/* <button className="btn btn-primary">Open Directory</button> */}
        {/* <p>Hello</p> */}
        <div className="overflow-auto">{receivedExperiments && expComp}</div>
        <div className="flex growplace-content-center">
          <p className="self-center"></p>
        </div>
      </div>
      {/* <SelectPath dirPaths={dirPaths} disabled={allowSelect}></SelectPath> */}
    </div>
  );
};

export default activeExperiment;
