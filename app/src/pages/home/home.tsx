import React from "react";
import TestingConfig from "../config/TestingConfig";

const Home = (): React.JSX.Element => {
  return (
    <div>
      <h1>Welcome to Nimble AB!</h1>

      <TestingConfig></TestingConfig>
    </div>
  );
};

export default Home;
