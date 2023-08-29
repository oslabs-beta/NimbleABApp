import React, { useState } from "react";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import VariantRow from "./VariantRow";
import CreateVariant from "./CreateVariant";
import { PrismaClient } from "@prisma/client";
// initialize Supabase client
const supabaseUrl = "https://tawrifvzyjqcddwuqjyq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhd3JpZnZ6eWpxY2Rkd3VxanlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI2NTc2MjcsImV4cCI6MjAwODIzMzYyN30.-VekGbd6Iwey0Q32SQA0RxowZtqSlDptBhlt2r-GZBw";
const supabase = createClient(supabaseUrl, supabaseKey);

interface RowProps {
  index: number;
}

const TestingConfig: React.FC = () => {
  const [rows, setRows] = useState<React.FC<RowProps>[]>([]);
  const [totalWeight, setTotalWeight] = useState<number>(0);

  const handleAddRow = () => {
    setRows([...rows, VariantRow]);
  };

  // const handleCalculateTotal = () => {
  //   const calculatedTotal = rows.reduce((acc, row) => acc + row.weight, 0);
  //   setTotalWeight(calculatedTotal);
  // };

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

  /// functionality

  // check to see if existing experiment exists. Use the sqlLite storage to do this

  // if exists display at top

  return (
    <div className="h-screen w-full bg-primary flex p-10 gap-2 font-mono">
      {/* <form>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </form>
      <p>Name: {formData.name}</p>
      {rows.map((VariantRow, index) => (
        <VariantRow index={index}></VariantRow>
      ))}
      <CreateVariant></CreateVariant> */}

      <button
        className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
        onClick={handleAddRow}
      >
        Add Variant
      </button>

      <button
        className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
        onClick={handleSubmit}
      >
        Submit Experiment
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
