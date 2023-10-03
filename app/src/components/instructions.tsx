import React from 'react';


const Instructions = (): React.JSX.Element => {
 
//Make this more robust
  return (
    <div className="mx-auto rounded-xl w-full h-60 bg-slate-800 text-white p-2 flex flex-col items-center font-mono mt-2">
      <h1 className="text-lg mb-2">Instructions</h1>
      <p className='mb-2'><strong>You can either create an experiment or edit an existing one!</strong></p>
      <p className='self-start mb-4'>1. Name your experiment! Make sure the name relates to the repo you are running the experiment on.</p>
      <p className='self-start mb-4'>2. Open a Next JS Project's <strong>app</strong> or <strong>src</strong> folder.</p>
      <p className='self-start mb-4'>3. Choose a path you wish to run your experiment on. Make sure it is a public facing path!</p>
      <p className='self-start'>4. Lastly, press the <strong>Create Experiment</strong> button to take you to the variant configuation page.</p>
    </div>
  );
};

export default Instructions;
