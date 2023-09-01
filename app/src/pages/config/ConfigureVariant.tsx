import React, { useContext } from "react";
import VariantRow from "./VariantRow";
import { useState } from "react";

const ConfigureVariant = () => {
  // state value to show the config or not
  const [show, showUnshow] = useState(false);
  const variantObj = {};
  const variantContext = React.createContext({});

  const handleSubmit = async () => {
    // when we submit variant we should add a variant to local, close off the row. The table component will read the state change and update

    // add to local
    window.electronAPI.addVariant;
  };
  //
  return (
    <variantContext.Provider value={variantObj}>
      <div>
        <button
          onClick={() => showUnshow(!show)}
          className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
        >
          Configure variant
        </button>
        {show ? <VariantRow></VariantRow> : null}

        <button
          className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
          onClick={handleSubmit}
        >
          Submit Experiment
        </button>
      </div>
    </variantContext.Provider>
  );
};

export default ConfigureVariant;