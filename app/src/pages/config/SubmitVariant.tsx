import React from "react";
import { useState } from "react";
interface VariantProps {
  // deviceType: string;
  weight: number | null;
  filePath: string;
  experiment_ID: number;
}

const SubmitVariant: React.FC<VariantProps> = (props) => {
  const [variant, updateVariant] = useState({});

  const submitToDB = async () => {
    try {
      console.log(props.filePath);
      const variantObj = {
        filePath: props.filePath,
        weight: props.weight,
        experimentId: props.experiment_ID,
      };
      await window.electronAPI.addVariant(variantObj);
      console.log("variant added");
    } catch (error) {
      console.log("error in the Submit Variant component ", error);
    }
    return;
  };

  return (
    <div>
      <button onClick={submitToDB}>Submit Variant</button>
    </div>
  );
};

export default SubmitVariant;
