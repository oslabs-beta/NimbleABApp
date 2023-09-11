import React, { useState, useEffect } from "react";
import { Variant } from "./TestingConfig";

interface VariantProps {
  variant: Variant[];
}

const VariantDisplay: React.FC<VariantProps> = ({ variant }) => {
  const [variants, setDisplayVariants] = useState<Variant[]>([]);
  // get the variant data to display
  useEffect(() => {
    setDisplayVariants(variant);
  }, [variant]);

  return (
    <div
      id="variantAnchor"
      className="h-screen w-1/2 bg-primary flex flex-col p-10 gap-2 font-mono"
    >
      <h2 className="text-white">Variants</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
            >
              File Path
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
            >
              Weight
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
            >
              Device Type
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {variants.map((variant, index) => (
            <tr key={index}>
              <td>{variant.filePath}</td>
              <td>{variant.weight}</td>
              <td>{variant.deviceType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VariantDisplay;
