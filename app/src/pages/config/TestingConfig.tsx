import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import VariantRow from "./ConfigureVariantComponents/VariantRow";
import CreateVariant from "./VariantDisplayComponents/EditVariant";
import { PrismaClient } from "@prisma/client";
import { IElectronAPI } from "../../../../renderer";
import { createContext, useEffect } from "react";
import VariantDisplay from "./VariantDisplayComponents/VariantDisplay";
import exp from "constants";
import { v4 as uuidv4 } from "uuid";
import { useLocation } from "react-router-dom";
import { UseSelector } from "react-redux/es/hooks/useSelector";
import ExperimentDropDown from "./Unused/ExperimentDropDown";
import ConfigureVariant from "./ConfigureVariantComponents/ConfigureVariant";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

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

interface ExperimentContextType {
  experimentId: any;
  experimentPath: string;
  repoId: string | number;
  directoryPath: string;
  experimentName: string;
}

export const experimentContext = createContext<ExperimentContextType | null>(
  null
);

const TestingConfig: React.FC = () => {
  // declare state variables
  const [rows, setRows] = useState<React.FC<RowProps>[]>([]);
  const [totalWeight, setTotalWeight] = useState<number>(0);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [experimentObj, updateExperimentObj] = useState({});

  // use Redux for the repo path
  const repoPath = useSelector(
    (state: RootState) => state.experiments.repoPath
  );

  // get state data sent from the home page
  const location = useLocation();
  const {
    experimentName,
    experimentPath,
    repoId,
    experimentId,
    directoryPath,
  } = location.state;

  // get variants data from the server
  const getVariants = async (id: number | string) => {
    try {
      // async call to the local server
      const variantsString = await window.electronAPI.getVariants(experimentId);
      // returned as a JSON formatted string; parse out
      const rawVariants = JSON.parse(variantsString);
      // the server returns an object with an array of length 1 containing an array of objects. This is due Prisma default formatting. Assign the variants variable this array of variant objects
      const variants = rawVariants[0].Variants;
      // generate the meaningful data we want
      const newVariants = variants.map((variant: any) => ({
        filePath: variant.filePath,
        weight: variant.weights,
        deviceType: variant.deviceType, // deprecated ; removal of variant-level references to device type is an opp to address tech debt
      }));

      setVariants(newVariants); // Update the variants state
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  // component functionality: get experiment if exists on user's local
  async function getExperimentdata() {
    const experimentData = await window.electronAPI.getExperiments();
    // if experiment data is falsy, inform the user. This indicates larger breakage
    if (!experimentData) {
      alert(
        "No experiment was found - please contact Nimble Team with bug report"
      );
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
  }, []);

  // getVariants(experimentId);
  //use effect to listen out for updates to variant rows

  return (
    <div className="h-screen w-full bg-primary flex flex-col font-mono">
      <experimentContext.Provider
        value={{
          experimentId,
          experimentPath,
          repoId,
          directoryPath,
          experimentName,
        }}
      >
        <div className="w-1/2 bg-primary flex flex-col p-10 gap-2 font-mono">
          {experimentName ? (
            <p className="text-white">
              Configuration for experiment <br></br>{" "}
              <strong>{experimentName}</strong>
            </p>
          ) : (
            "No experiment active; return to home and create new"
          )}
          <ConfigureVariant></ConfigureVariant>
        </div>
        <VariantDisplay variant={variants}></VariantDisplay>
      </experimentContext.Provider>
    </div>
  );
};

export default TestingConfig;
