import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
interface VariantProps {
  // deviceType: string;
  weight: number | null;
  filePath: string;
  experiment_ID: number;
}

const SubmitVariant: React.FC<VariantProps> = (props) => {
  const [variant, updateVariant] = useState({});

  const location = useLocation();
  const submitToDB = async () => {
    const variantUuid = uuidv4();

    const { directoryPath, experimentId, experimentPath } = location.state;
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

    // submit to the supabase db
    try {
      console.log("the experiment id pulled off state: " + experimentId);
      const response = await axios.post(
        "https://nimblebackend-te9u.onrender.com/createVariants",
        {
          variant_id: variantUuid,
          variant_name: props.filePath,
          variant_weight: props.weight,
          experimentId: experimentId,
        }
      );
      console.log(response.status + " is the reponse status");
      console.log("successfully posted, check database");
    } catch (error) {
      console.log(
        "error in the axios request in submit Variant component ",
        error
      );
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
