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
    <div id="variantAnchor" className="h-80  rounded-xl w-1/2 flex flex-col ml-20 bg-slate-800 font-mono overflow-auto">
      {/* <h2 className="text-white">Variants</h2> */}
      <table className="min-w-full divide-y divide-gray-200 overflow-auto">
        <thead className="bg-slate-800 relative top-0 sticky">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-center text-xs font-medium text-white uppercase"
            >
              Variants
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-center text-xs font-medium text-white uppercase"
            >
              Weight
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-center text-xs font-medium text-white uppercase"
            >
              Edit
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-center text-xs font-medium text-white uppercase"
            >
              Delete
            </th>
          </tr>
        </thead>
        <tbody className="text-white text-center bg-slate-800 divide-y divide-gray-200/50 overflow-auto">
          {variants.map((variant, index) => (
            <tr key={index} className="h-16 overflow-auto">
              <td >{variant.filePath}</td>
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
        <div className="text-white text-center bg-slate-800">
          <p className="text-error">
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
