import React, { useState } from "react";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

// initialize Supabase client
const supabaseUrl = "https://tawrifvzyjqcddwuqjyq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhd3JpZnZ6eWpxY2Rkd3VxanlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI2NTc2MjcsImV4cCI6MjAwODIzMzYyN30.-VekGbd6Iwey0Q32SQA0RxowZtqSlDptBhlt2r-GZBw";
const supabase = createClient(supabaseUrl, supabaseKey);

interface Row {
  variant: string;
  weight: number | string;
}

const TestingConfig: React.FC = () => {
  const [rows, setRows] = useState<Row[]>([{ variant: "", weight: "" }]);
  const [totalWeight, setTotalWeight] = useState<number>(0);

  const handleVariantChange = (index: number, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index].variant = value;
    setRows(updatedRows);
  };

  const handleWeightChange = (index: number, value: string) => {
    const updatedRows = [...rows];
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      updatedRows[index].weight = parsedValue;
      setRows(updatedRows);
    }
  };

  const handleAddRow = () => {
    setRows([...rows, { variant: "", weight: 0 }]);
  };

  const handleRemoveRow = (index: number) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleCalculateTotal = () => {
    const calculatedTotal = rows.reduce((acc, row) => acc + row.weight, 0);
    setTotalWeight(calculatedTotal);
  };

  const getVariants = async () => {
    // destructure the data object
    const { data, error } = await supabase.from("variants").select();

    // reassign to more intuitive name
    const variants = data;
    console.log("variants retrieved : ", variants);
    console.log(error);
  };

  const handleSubmit = () => {
    if (totalWeight === 100) {
      // Submit logic here
      console.log("Weights are valid. Submitting...");
    } else {
      alert("Weights must sum up to 100%.");
    }
  };

  return (
    <div>
      {rows.map((row, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Variant URL"
            value={row.variant}
            onChange={(e) => handleVariantChange(index, e.target.value)}
          />
          <input
            type="number"
            placeholder="Weight"
            value={row.weight}
            onChange={(e) => handleWeightChange(index, e.target.value)}
          />
          <button
            className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
            onClick={() => handleRemoveRow(index)}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
        onClick={handleAddRow}
      >
        Add Row
      </button>
      <button
        className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
        onClick={handleCalculateTotal}
      >
        Calculate Total
      </button>
      <p>Total Weight: {totalWeight}%</p>
      <button
        className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
        onClick={handleSubmit}
      >
        Submit
      </button>

      <button
        className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
        onClick={getVariants}
      >
        Check the variants (console.log)
      </button>
    </div>
  );
};

export default TestingConfig;
