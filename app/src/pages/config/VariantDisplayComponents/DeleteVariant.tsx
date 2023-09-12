import React, { useState, useContext, createContext } from "react";
interface VariantProps {
  experimentID: string;
  directoryPath: string;
  experimentPath: string;
  filePath: string;
}

const DeleteVariant: React.FC<VariantProps> = (props) => {
  const [variantPath, setVariantPath] = useState("");

  // get the "repo" path

  const createVariant = async () => {
    const variant = {
      filePath: variantPath,
      experimentId: props.experimentID,
    };
    console.log("insert the create variant code");
    return;
  };

  const handleClick = async () => {
    // open the modal
    console.log("opened the modal");
    // pass down directory, experiment path, filepath
    await window.electronAPI.createModal({
      experimentPath: props.experimentPath,
      directoryPath: props.directoryPath,
      filePath: props.filePath,
    });
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
