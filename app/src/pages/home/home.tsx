import React from 'react';
import ExperimentCreate from '../../components/experimentCreate';
import ActiveExperiment from '../../components/activeExperiments';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { IElectronAPI } from '../../../../renderer';
import Instructions from '../../components/instructions';

const Home = (): React.JSX.Element => {


  return (
    <>
      <div className='h-screen w-full bg-primary p-10'>
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
