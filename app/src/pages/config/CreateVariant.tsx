import React from "react";

const CreateVariant: React.FC = (props) => {
  const createVariant = () => {
    console.log("insert the create variant code");
    return;
  };

  return (
    <div>
      <button className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
        Create a new Variant
      </button>
    </div>
  );
};

export default CreateVariant;
