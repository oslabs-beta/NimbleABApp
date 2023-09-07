import React from 'react';
import ExperimentCreate from '../../components/experimentCreate';
import ActiveExperiment from '../../components/activeExperiments';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { IElectronAPI } from '../../../../renderer';

const Home = (): React.JSX.Element => {
  async function handleModal() {
    const data = await window.electronAPI.createModal();
    console.log(data);
  }

  return (
    <>
      <div className="h-screen w-full bg-primary flex p-10 gap-2 font-mono">
        <ExperimentCreate></ExperimentCreate>
        <ActiveExperiment></ActiveExperiment>
        <button>
          <Link to="/config"> Configure new experiment</Link>
        </button>
      </div>
      <button className="btn btn-primary" onClick={handleModal}>
        Create Text Modal
      </button>
    </>
  );
};

export default Home;
