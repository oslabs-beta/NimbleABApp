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
import { v4 as uuidv4 } from "uuid";
import { useLocation } from "react-router-dom";
import { UseSelector } from "react-redux/es/hooks/useSelector";
import ExperimentDropDown from "./ExperimentDropDown";
import ConfigureVariant from "./ConfigureVariant";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
// initialize Supabase client

// current defects:
// 1. Doesn't build an experiment object
// 2. Doesn't post to the database
// 3. Existing variants aren't displayed correctly
// 4. Layout of new creation fields
// 5. No modal on click
// 6. No back button to homepage
// 7. Change database IDs to UUIDs

const supabaseUrl = "https://tawrifvzyjqcddwuqjyq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhd3JpZnZ6eWpxY2Rkd3VxanlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI2NTc2MjcsImV4cCI6MjAwODIzMzYyN30.-VekGbd6Iwey0Q32SQA0RxowZtqSlDptBhlt2r-GZBw";
const supabase = createClient(supabaseUrl, supabaseKey);
interface RowProps {
  index: number;
}

export interface Variant {
  filePath: string;
  weight: number;
  deviceType: string;
}

interface Experiment {
  name: string;
  variants: [];
}

const TestingConfig: React.FC = () => {
  const [rows, setRows] = useState<React.FC<RowProps>[]>([]);
  const [totalWeight, setTotalWeight] = useState<number>(0);

  const [variants, setVariants] = useState<Variant[]>([]);
  // const [experimentName, updateExperimentName] = useState<string>("");
  // const [experimentId, updateExperimentId] = useState(0);

  const repoPath = useSelector(
    (state: RootState) => state.experiments.repoPath
  );

  const location = useLocation();

  // Access the state data you passed in the Navigate component
  const {
    experimentName,
    experimentPath,
    repoId,
    experimentId,
    directoryPath,
    // Other state data you passed
  } = location.state;

  // build this throughout and then submit
  const [experimentObj, updateExperimentObj] = useState({});

  const getVariants = async (id: number | string) => {
    try {
      // this is a typescript error that doesn't prevent us from running. We're going to leave it this way and debut post demo
      console.log("reached getVariants");
      console.log(experimentId);
      const variantsString = await window.electronAPI.getVariants(experimentId);
      const rawVariants = JSON.parse(variantsString);
      const variants = rawVariants[0].Variants;

      console.log("reached getVariants func after api call");
      console.log("Variants retrieved: ", variants);

      const newVariants = variants.map((variant: any) => ({
        filePath: variant.filePath,
        weight: variant.weight,
        deviceType: variant.deviceType,
      }));

      console.log("Done with the newVariants declaration");
      console.log(newVariants.length);
      console.log(newVariants);
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

  // component functionality: get experiment if exists on user's local
  async function getExperimentdata() {
    const experimentData = await window.electronAPI.getExperiments();
    // if experiment data is falsy, inform the user
    if (!experimentData) {
      alert("No experiment was found");
    } else {
      console.log("Returned the experiment data");

      return experimentData;
    }
  }

  async function main() {
    try {
      console.log(repoPath + " if there's a file path, redux is working");
      const experimentObjectString = await getExperimentdata();

      const experimentObject = JSON.parse(experimentObjectString);
      getVariants(experimentId);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  useEffect(() => {
    main();
    console.log(variants);
  }, []);

  // getVariants(experimentId);
  //use effect to listen out for updates to variant rows

  return (
    <div className="h-screen w-full bg-primary flex font-mono">
      <div className="h-screen w-1/2 bg-primary flex flex-col p-10 gap-2 font-mono">
        {experimentName ? (
          <p className="text-white">
            Configuration for experiment <br></br>{" "}
            <strong>{experimentName}</strong>
          </p>
        ) : (
          "No experiment active; return to home and create new"
        )}
        <ExperimentDropDown></ExperimentDropDown>
        <CreateVariant
          experimentID={experimentId}
          directoryPath={directoryPath}
          experimentPath={experimentPath}
        ></CreateVariant>
        <ConfigureVariant></ConfigureVariant>
      </div>
      <VariantDisplay variant={variants}></VariantDisplay>
    </div>
  );
};

export default TestingConfig;
