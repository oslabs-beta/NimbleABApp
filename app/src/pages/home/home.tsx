import React from "react";
import ExperimentCreate from "../../components/experimentCreate";
import ActiveExperiment from "../../components/activeExperiments";

const Home = (): React.JSX.Element => {
  return (
    <div className="h-screen w-full bg-primary flex p-10 gap-2 font-mono">
      <ExperimentCreate></ExperimentCreate>
      <ActiveExperiment></ActiveExperiment>
    </div>
  );
};

export default Home;
