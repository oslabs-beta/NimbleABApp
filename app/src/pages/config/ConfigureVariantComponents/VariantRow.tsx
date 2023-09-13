import React, { ChangeEvent, useState, useContext } from "react";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import CreateVariant from "../VariantDisplayComponents/EditVariant";
import SubmitVariant from "./SubmitVariant";
import { experimentContext } from "../TestingConfig";

interface Row {
  variantURL: string;
  weight: number | null;
  deviceType: string;
}

const VariantRow: React.FC = () => {
  // set up state with the row's data
  const [thisRow, setThisRow] = useState<Row>({
    variantURL: "",
    weight: null,
    deviceType: "",
  });

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

  const [isDestroyed, setIsDestroyed] = useState(false);

  // handle text change in the variant input
  const handleVariantChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { weight, deviceType } = thisRow;
    const text = e.target.value;
    setThisRow({
      variantURL: text,
      weight: weight,
      deviceType: deviceType,
    });
  };

  const handleWeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { variantURL, deviceType } = thisRow;
    const weight = parseFloat(e.target.value);
    if (!isNaN(weight)) {
      setThisRow({
        variantURL: variantURL,
        weight: weight,
        deviceType: deviceType,
      });
    }
  };

  const handleDestroy = () => {
    setIsDestroyed(true);
  };

  const handleSubmit = () => {
    console.log("insert database logic here");
  };

  // check for is destroyed in the FC itself, render null if so
  if (isDestroyed) return null;

  return (
    <div className="flex flex-col items-center">
      <input
        className="border border-grey-500"
        type="text"
        placeholder="Variant File Path"
        value={thisRow.variantURL}
        onChange={handleVariantChange}
      />
      <input
        className="border border-grey-500"
        type="number"
        placeholder="% weight (as int)"
        value={thisRow.weight ? thisRow.weight : ""}
        onChange={handleWeightChange}
      />

      <SubmitVariant
        weight={thisRow.weight}
        filePath={thisRow.variantURL}
        experiment_ID={experimentId}
      ></SubmitVariant>
    </div>
  );
};

export default VariantRow;
