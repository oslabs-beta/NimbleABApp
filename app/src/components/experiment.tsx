import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IElectronAPI } from "../../../renderer";
import { updateRepoPath } from "../redux/experimentsSlice";
interface experimentProps {
  data: any;
}
const experiment = ({ data }: experimentProps): React.JSX.Element => {
  const [clicked, setClicked] = useState(false);
  const [fullFilePath, setFullFilePath] = useState("");

  // console.log(fullFilePath);
  //Display relevant experiment data
  const {
    Experiment_Name,
    experiment_path,
    Device_Type,
    Repo_id,
    experiment_uuid,
  } = data;
  //When Edit button is clicked take to Config experiment page
  async function handleEditClick(): Promise<any> {
    const { FilePath } = await window.electronAPI.getRepo(Repo_id);
    console.log("File path in the local sqlite db", FilePath);
    setFullFilePath(FilePath);
    updateRepoPath(FilePath);
    setClicked(true);
  }
  return (
    <div className="flex  gap-4 mb-4 justify-around">
      <div className="w-24 overflow-hidden">
        <p className="">{Experiment_Name}</p>
      </div>
      <div className="w-24">
        <p>{experiment_path}</p>
      </div>
      <button onClick={handleEditClick} className="btn btn-success ">
        Edit
      </button>
      {clicked && (
        <Navigate
          to="/config"
          state={{
            experimentName: Experiment_Name,
            experimentPath: experiment_path,
            repoId: Repo_id,
            experimentId: experiment_uuid,
            directoryPath: fullFilePath,
            //Need to also send james the fulldirectorypath
          }}
          replace={true}
        />
      )}
    </div>
  );
};

export default experiment;
