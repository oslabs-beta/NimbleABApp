import React, { useState, useEffect, useContext } from "react";
import { Variant } from "./TestingConfig";
import CreateVariant from "./CreateVariant";
import { experimentContext } from "./TestingConfig";

interface VariantProps {
  variant: Variant[];
}

const VariantDisplay: React.FC<VariantProps> = ({ variant }) => {
  const [variants, setDisplayVariants] = useState<Variant[]>([]);
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

  console.log(directoryPath + " successfully pulled off react context hook");
  console.log(experimentName + " successfully pulled off react context hook");
  console.log(experimentId + " successfully pulled off react context hook");
  console.log(experimentPath + " successfully pulled off react context hook");

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
              <td>
                <CreateVariant
                  experimentID={experimentId}
                  directoryPath={directoryPath}
                  experimentPath={experimentPath}
                  filePath={variant.filePath}
                ></CreateVariant>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VariantDisplay;
