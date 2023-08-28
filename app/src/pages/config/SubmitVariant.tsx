import React from "react";

interface VariantProps {
  deviceType: string;
  weight: number;
  url: string;
}

const SubmitVariant: React.FC<VariantProps> = (props) => {
  const submitToDB = () => {
    console.log("insert the create variant code");
    return;
  };

  return (
    <div>
      <button onClick={submitToDB}>Enter Variant</button>
    </div>
  );
};

export default SubmitVariant;
