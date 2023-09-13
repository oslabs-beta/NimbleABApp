import React from "react";
import ExperimentCreate from "../../components/experimentCreate";
import ActiveExperiment from "../../components/activeExperiments";
import Instructions from "../../components/instructions";
import { v4 as uuidv4 } from "uuid";

const Home = (): React.JSX.Element => {
  const setUserId = () => {
    // check to see if user ID cookie exists, if yes then do nothing, if no then set a new one      // check to see if user ID cookie exists, if yes then do nothing, if no then set a new one
    const userIdCookie = document.cookie.includes("user_id");
    if (!userIdCookie) {
      const newUserId = uuidv4();
      document.cookie = "user_id=" + newUserId;
    }
  };
  return (
    <>
      <div className="h-screen w-full bg-gradient-to-r from-teal-500 to-indigo-800  p-10">
        <div className="flex  gap-2 font-mono ">
          <ExperimentCreate></ExperimentCreate>
          <ActiveExperiment></ActiveExperiment>
        </div>
        <Instructions></Instructions>
      </div>
    </>
  );
};

export default Home;
