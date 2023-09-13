import React, { useContext, useState } from "react";
import VariantRow from "./VariantRow";
import SubmitVariant from "./SubmitVariant";

const ConfigureVariant = () => {
  // state value to show the config or not
  const [show, showUnshow] = useState(false);
  const variantObj = {};
  const variantContext = React.createContext({});

  const handleSubmit = async () => {
    // when we submit variant we should add a variant to local, close off the row. The table component will read the state change and update
    show;
    // add to local
    window.electronAPI.addVariant(variantObj);
  };
  //
  return (
    <variantContext.Provider value={variantObj}>
      <div className="flex flex-col">
        <button
          onClick={() => showUnshow(!show)}
          className="btn btn-success m-2"
        >
          Configure variant
        </button>
        <VariantRow></VariantRow>
      </div>
    </variantContext.Provider>
  );
};

export default ConfigureVariant;
