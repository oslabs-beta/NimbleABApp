import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

interface Row {
  variant: string;
  weight: number;
}

interface RowProps {
  index: number;
}

const VariantRow: React.FC<RowProps> = (props: RowProps) => {
  // set up state with the row's data
  const [thisRow, setThisRow] = useState<Row>({
    variant: "",
    weight: 0,
  });

  const [isDestroyed, setIsDestroyed] = useState(false);

  // handle text change in the variant input
  const handleVariantChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { weight } = thisRow;
    const text = e.target.value;
    setThisRow({
      variant: text,
      weight: weight,
    });
  };

  const handleWeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { variant } = thisRow;
    const weight = parseFloat(e.target.value);
    if (!isNaN(weight)) {
      setThisRow({
        variant: variant,
        weight: weight,
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
        value={thisRow.variant}
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

      <button
        className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default VariantRow;
