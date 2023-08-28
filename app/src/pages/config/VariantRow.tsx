import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import CreateVariant from "./CreateVariant";
import SubmitVariant from "./SubmitVariant";

interface Row {
  variantURL: string;
  weight: number;
  deviceType: string;
}

interface RowProps {
  index: number;
}

const VariantRow: React.FC<RowProps> = (props: RowProps) => {
  // set up state with the row's data
  const [thisRow, setThisRow] = useState<Row>({
    variantURL: "",
    weight: 0,
    deviceType: "",
  });

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
    <div key={props.index}>
      <input
        type="text"
        placeholder="Variant URL"
        value={thisRow.variantURL}
        onChange={handleVariantChange}
      />
      <input
        type="number"
        placeholder="Weight"
        value={thisRow.weight}
        onChange={handleWeightChange}
      />
      <button
        className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
        onClick={handleDestroy}
      >
        Remove
      </button>
      <SubmitVariant
        deviceType={thisRow.deviceType}
        weight={thisRow.weight}
        url={thisRow.variantURL}
      ></SubmitVariant>
    </div>
  );
};

export default VariantRow;
