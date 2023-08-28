import React from "react";
import ExperimentCreate from "../../components/experimentCreate";
import ActiveExperiment from "../../components/activeExperiments";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
const Home = (): React.JSX.Element => {
  return (
    <div className="h-screen w-full bg-primary flex p-10 gap-2 font-mono">
      <ExperimentCreate></ExperimentCreate>
      <ActiveExperiment></ActiveExperiment>
      <button>
        <Link to="/config"> Configure new experiment</Link>
      </button>
    </div>
  );
};

export default Home;
