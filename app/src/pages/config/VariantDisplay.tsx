import React from "react";

interface VariantDisplayProps {
  filepath: string;
  weight: number;
  deviceType: string;
}

const VariantDisplay: React.FC<VariantDisplayProps> = ({
  filepath,
  weight,
  deviceType,
}) => {
  return (
    <div className="variant-row">
      <p className="filepath">{filepath}</p>
      <p className="weight">{weight}%</p>
      <p className="device-type">{deviceType}</p>
    </div>
  );
};

export default VariantDisplay;
