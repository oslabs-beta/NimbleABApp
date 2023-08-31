import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import VariantRow from "./VariantRow";
import CreateVariant from "./CreateVariant";
import { PrismaClient } from "@prisma/client";
import { IElectronAPI } from "../../../../renderer";
import { useContext, useEffect } from "react";
import NameExperiment from "./NameExperiment";
import VariantDisplay from "./VariantDisplay";
import exp from "constants";
// initialize Supabase client
const supabaseUrl = "https://tawrifvzyjqcddwuqjyq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhd3JpZnZ6eWpxY2Rkd3VxanlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI2NTc2MjcsImV4cCI6MjAwODIzMzYyN30.-VekGbd6Iwey0Q32SQA0RxowZtqSlDptBhlt2r-GZBw";
const supabase = createClient(supabaseUrl, supabaseKey);
interface RowProps {
  index: number;
}

interface Variant {
  filePath: string;
  weight: number;
  deviceType: string;
}

const TestingConfig: React.FC = () => {
  const [rows, setRows] = useState<React.FC<RowProps>[]>([]);
  const [totalWeight, setTotalWeight] = useState<number>(0);

  const [variants, setVariants] = useState<Variant[]>([]);
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
    try {
      const variantsString = await window.electronAPI.getVariants(1);
      const variants = JSON.parse(variantsString);

      console.log("Variants retrieved: ", variants);

      const newVariants = variants.map((variant: any) => ({
        filePath: variant.filePath,
        weight: variant.weight,
        deviceType: variant.deviceType,
      }));

      setVariants(newVariants); // Update the variants state
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleSubmit = () => {
    if (totalWeight === 100) {
      // Submit logic here
      console.log("Weights are valid. Submitting...");
    } else {
      alert("Weights must sum up to 100%.");
    }
  };

  // if exists display at top
  const handleExperienceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateExperimentName(e.target.value);
  };

  // component functionality: get experiment if exists on user's local
  async function getExperimentdata() {
    return await window.electronAPI.getExperiments();
  }

  async function main() {
    try {
      const experimentObjectString = await getExperimentdata();
      const experimentObject = JSON.parse(experimentObjectString);
      updateExperimentId(experimentObject[0].experiment_ID);
      updateExperimentName(experimentObject[0].Experiment_Name);
      console.log("Promise resolved successfully");
      console.log(experimentObject + " is the experiment object");
      console.log(
        Object.keys(experimentObject) + " are the return object keys"
      );
      console.log(experimentName + " is the state experiment name value");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  //use effect to listen out for updates to variant rows

  useEffect(() => {
    // Listen for changes in the rows state
    if (rows.length > 0) {
      // Assuming VariantRow is a component
      const newRow = (
        <VariantRow index={rows.length - 1} key={rows.length - 1} />
      );
      const newRowContainer = document.createElement("div");
      ReactDOM.render(newRow, newRowContainer);

      const newRowAnchor = document.getElementById("newRowAnchor");
      if (newRowAnchor) {
        newRowAnchor.appendChild(newRowContainer);
      }
    }
  }, [rows]);
  main();

  return (
    <div className="h-screen w-full bg-primary flex font-mono">
      <div className="h-screen w-full bg-primary flex flex-col p-10 gap-2 font-mono">
        {experimentName ? (
          <p>
            Configuration for experiment <br></br>{" "}
            <strong>{experimentName}</strong>
          </p>
        ) : (
          <NameExperiment></NameExperiment>
        )}
        <CreateVariant experimentID={experimentId}></CreateVariant>
        <div id="newRowAnchor" className="flex flex-col flex-auto w-36">
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
      <div id="variantAnchor">
        {variants.map((variant, index) => (
          <VariantDisplay
            key={index}
            filepath={variant.filePath}
            weight={variant.weight}
            deviceType={variant.deviceType}
          />
        ))}
      </div>
    </div>
  );
};

export default TestingConfig;
