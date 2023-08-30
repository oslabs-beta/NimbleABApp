import React, { useState, useContext, createContext } from "react";
interface VariantProps {
  experimentID: number;
}

const CreateVariant: React.FC<VariantProps> = (props) => {
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

  return (
    <div>
      <button className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
        Create a new Variant
      </button>
    </div>
  );
};

export default CreateVariant;
