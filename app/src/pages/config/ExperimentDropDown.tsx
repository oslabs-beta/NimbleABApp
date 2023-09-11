import React from "react";
import { useState, useEffect } from "react";

const ExperimentDropDown: React.FC<any> = () => {
  // this component needs to render a drop down of all experience names on the user's local.
  // pull the experiments from local, save into array

  // initialize state values for open and closed drop down
  const [open, setOpen] = useState(false);
  const [experimentNames, setExperimentNames] = useState<string[]>([]);
  // an open handler for the dropdown click
  const handleOpen = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const getExperiments = async () => {
      try {
        const experiments = await window.electronAPI.getExperiments();
        setExperimentNames(experiments);
        console.log(experimentNames, " are the experiment names");
      } catch (Error) {
        // no verbose messaging because we are logging to client
        console.log("Error fetching experiments");
      }
    };
  }, [open]);

  // return a button and drop down

  return (
    <div id="experimentDropDown">
      <button
        className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
        onClick={handleOpen}
      >
        Select another experiment
      </button>
      {open ? (
        <div>
          <p>Is Open</p>
          <select>
            {/* Map over experimentNames to populate dropdown options */}
            {experimentNames.map((experimentName, index) => (
              <option key={index} value={experimentName}>
                {experimentName}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div>Is Closed</div>
      )}
    </div>
  );
};

export default ExperimentDropDown;
