import React, { useState, useEffect, useContext } from "react";
import { Variant } from "../TestingConfig";
import CreateVariant from "./EditVariant";
import { experimentContext } from "../TestingConfig";
import DeleteVariant from "./DeleteVariant";

interface VariantProps {
  variant: Variant[];
}

const VariantDisplay: React.FC<VariantProps> = ({ variant }) => {
  const [weightsWarning, setWeightsWarning] = useState(false);
  const [variants, setDisplayVariants] = useState<Variant[]>([]);
  const [reset, causeReset] = useState(false);

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
  // get the variant data to display
  useEffect(() => {
    setDisplayVariants(variant);

    const totalWeight = variant.reduce(
      (sum, currentVariant) => sum + currentVariant.weight,
      0
    );
    if (totalWeight != 100) {
      setWeightsWarning(true);
    }
  }, [variant]);

  return (
    <div id="variantAnchor" className="flex flex-col p-10 gap-2 font-mono">
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
              Edit
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
            >
              Delete
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {variants.map((variant, index) => (
            <tr key={index}>
              <td>{variant.filePath}</td>
              <td>{variant.weight}</td>
              <td>
                <CreateVariant
                  experimentID={experimentId}
                  directoryPath={directoryPath}
                  experimentPath={experimentPath}
                  filePath={variant.filePath}
                ></CreateVariant>
              </td>
              <td>
                <DeleteVariant filePath={variant.filePath}></DeleteVariant>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {weightsWarning ? (
        <div className="text-white">
          <p className="text-red">
            Warning - weights must sum to 100 for experiment to be valid
          </p>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default VariantDisplay;
