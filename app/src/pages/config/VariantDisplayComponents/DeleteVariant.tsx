import React, { useState, useContext, createContext } from "react";
import { experimentContext } from "../TestingConfig";
interface DeleteProps {
  filePath: string;
}
const DeleteVariant: React.FC<DeleteProps> = (props) => {
  const [variantPath, setVariantPath] = useState("");

  const { reload } = useContext(experimentContext);

  let directoryPath: string = "";
  let experimentName: string = "";
  let experimentPath: string = "";
  let experimentId: string = "";
  const context = useContext(experimentContext);
  if (context) {
    directoryPath = context.directoryPath;
    experimentName = context.experimentName;
    experimentPath = context.experimentPath;
    experimentId = context.experimentId;
  }

  const handleClick = async () => {
    // open the modal
    console.log("opened the modal");
    // pass down directory, experiment path, filepath
    await window.electronAPI.removeVariant({
      filePath: props.filePath,
    });
    reload();
  };

  return (
    <div>
      <button onClick={handleClick} className="btn btn-success">
        delete
      </button>
    </div>
  );
};

export default DeleteVariant;
