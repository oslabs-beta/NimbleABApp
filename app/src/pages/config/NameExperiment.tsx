import React, { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateExperimentName,
  updateExperimentId,
} from "../../redux/experimentsSlice";

interface RootState {
  experimentName: string;
  experimentId: number;
  repoPath: string;
}
const NameExperiment: React.FC = () => {
  const Dispatch = useDispatch();
  const [name, updateName] = useState("");
  //   const Selector = useSelector()

  const storageName = useSelector((state: RootState) => state.experimentName);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    Dispatch(updateExperimentName(e.target.value));
    // console.log(useSelector((state: RootState) => state.experimentName));
    console.log(storageName);
  };

  const handleExpSubmit = async () => {
    // schema definition as of right now: const {experimentName, deviceType} = experiment
    const experiment = {
      experimentName: useSelector((state: RootState) => state.experimentName),
      // CHANGE THIS LATER
      deviceType: "desktop",
    };
    if (experiment) await window.electronAPI.addExperiment(experiment);
    // await window.electronAPI.addExperiment("new Experiment");
    else alert("experiment must have a name");
  };
  return (
    <div>
      <input onChange={handleChange}></input>
      <button onClick={handleExpSubmit}>Submit experiment</button>
    </div>
  );
};

export default NameExperiment;
