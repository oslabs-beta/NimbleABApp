import React from "react";
import { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { experimentContext } from "../TestingConfig";
interface VariantProps {
  // deviceType: string;
  weight: number | null;
  filePath: string;
  experiment_ID: number | string;
}

const SubmitVariant: React.FC<VariantProps> = (props) => {
  const [variant, updateVariant] = useState({});

  // let reload
  const { reload } = useContext(experimentContext);

  const location = useLocation();

  const submitToDB = async () => {
    const variantUuid = uuidv4();
    const {
      directoryPath,
      experimentId,
      experimentPath,
      fullFilePath,
      repoId,
    } = location.state;
    console.log("the state", location.state);
    try {
      console.log(props.filePath);
      const variantObj = {
        filePath: props.filePath,
        weight: props.weight,
        experimentId: props.experiment_ID,
        experiment_uuid: experimentId,
        experimentPath,
        directoryPath,
        variantUuid,
      };
      await window.electronAPI.addVariant(variantObj);
      console.log("variant added");
      reload();
    } catch (error) {
      console.log("error in the Submit Variant component ", error);
    }
    return;
  };

  return (
    <div className="h-3 flex">
      <button onClick={submitToDB} className="btn btn-success m-2">
        Add Variant
      </button>
    </div>
  );
};

export default SubmitVariant;
