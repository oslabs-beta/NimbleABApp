import React, { useState, useContext, createContext } from "react";

interface DeleteProps {
  filePath: string;
}
const DeleteVariant: React.FC<DeleteProps> = (props) => {
  const [variantPath, setVariantPath] = useState("");

  // get the "repo" path

  const handleClick = async () => {
    // open the modal
    console.log("opened the modal");
    // pass down directory, experiment path, filepath
    await window.electronAPI.removeVariant({
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
