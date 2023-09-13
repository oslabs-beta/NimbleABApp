import React from "react";

const TestConfigInstructions = (): React.JSX.Element => {
  return (
    <div className="mx-auto rounded-xl w-full h-60 bg-slate-800 text-white p-2 flex flex-col flex-grow items-center font-mono mt-2">
      <h1 className="text-lg mb-2">Instructions</h1>
      <p className="mb-2">
        <strong>
          Configure a variant above. Add a file path name and a weight
        </strong>
      </p>
      <p className="self-start mb-4">
        Weights represent the percentage of page loads that should show a
        variant.
      </p>
      <p className="self-start mb-4">
        The file path selected will save to your local. Make it semantically
        relevant to the changes
      </p>
      <p className="self-start mb-4">
        Click edit to open the code editor to make the changes required for your
        variant. Save when finished and the updates will write to your repo
      </p>
      <p className="self-start">
        When finished with a valid experiment your local will have a variants
        folder containing all created variants, and a config.json middleware
        file that will return variants according to the weights and set a cookie
        to give return visitors a consistent experience
      </p>
    </div>
  );
};

export default TestConfigInstructions;
