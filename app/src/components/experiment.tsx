import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

interface experimentProps {
  data: any;
}
const experiment = ({ data }: experimentProps): React.JSX.Element => {
  const [clicked, setClicked] = useState(false);
  //Display relevant experiment data
  const {
    Experiment_Name,
    experiment_path,
    Device_Type,
    Repo_id,
    experiment_uuid,
  } = data;
  //When Edit button is clicked take to Config experiment page
  function handleEditClick(): void {
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
            //Need to also send james the fulldirectorypath
          }}
          replace={true}
        />
      )}
    </div>
  );
};

export default experiment;
