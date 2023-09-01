import React from "react";
import { useState, useEffect } from "react";

const ExperimentDropDown: React.FC<any> = () => {
  // this component needs to render a drop down of all experience names on the user's local.
  // pull the experiments from local, save into array

  const getExperiments = async () => {
    try {
      const experiments = window.electronAPI.getExperiments();
      return experiments;
    } catch (Error) {
      // no verbose messaging because we are logging to client
      console.log("Error fetching experiments");
    }
  };
  // initialize state values for open and closed drop down
  const [open, setOpen] = useState(false);

  // an open handler for the dropdown click
  const handleOpen = () => {
    setOpen(!open);
  };

  // return a button and drop down

  return (
    <div id="experimentDropDown">
      <button
        className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
        onClick={handleOpen}
      ></button>
      {open ? <div>Is Open</div> : <div>Is Closed</div>}
    </div>
  );
};

export default ExperimentDropDown;
