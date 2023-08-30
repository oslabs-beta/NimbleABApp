import React, { useState } from "react";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import VariantRow from "./VariantRow";
import CreateVariant from "./CreateVariant";
import { PrismaClient } from "@prisma/client";
import { IElectronAPI } from "../../../../renderer";
import { useContext } from "react";

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

  const [experimentName, updateExperimentName] = useState<string>("");
  const [experimentId, updateExperimentId] = useState(0);
  const handleAddRow = () => {
    setRows([...rows, VariantRow]);
  };

  // const handleCalculateTotal = () => {
  //   const calculatedTotal = rows.reduce((acc, row) => acc + row.weight, 0);
  //   setTotalWeight(calculatedTotal);
  // };

  const getVariants = async () => {
    // destructure the data object
    const variantsString = await window.electronAPI.getVariants(1);
    // reassign to more intuitive name
    const variants = JSON.parse(variantsString);

    console.log("variants retrieved : ", variants);
    // console.log(error);
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

  // if exists display at top
  const handleExperienceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateExperimentName(e.target.value);
  };

  const handleExpSubmit = async () => {
    // schema definition as of right now: const {experimentName, deviceType} = experiment
    const experiment = {
      experimentName: experimentName,
      // CHANGE THIS LATER
      deviceType: "desktop",
    };
    if (experimentName) await window.electronAPI.addExperiment(experiment);
    // await window.electronAPI.addExperiment("new Experiment");
    else alert("experiment must have a name");
  };

  // component functionality: get experiment if exists on user's local
  async function getExperimentdata() {
    return await window.electronAPI.getExperiments();
  }

  async function main() {
    try {
      const experimentObject = await getExperimentdata();
      console.log("Promise resolved successfully");
      console.log(experimentObject.Keys());
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  main();

  return (
    <div className="h-screen w-full bg-primary flex p-10 gap-2 font-mono">
      <form>
        <label htmlFor="name">Name your experiment</label>
        <input
          type="text"
          id="name"
          name="name"
          value={experimentName}
          onChange={handleExperienceInput}
        />
        <button onClick={handleExpSubmit}>Submit experiment name</button>
      </form>
      <p>Name: {FormData.name}</p>
      {rows.map((VariantRow, index) => (
        <VariantRow index={index}></VariantRow>
      ))}
      <CreateVariant experimentID={experimentId}></CreateVariant>

      <div className="flex flex-col flex-auto w-36">
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
    </div>
  );
};

export default TestingConfig;
