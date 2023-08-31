import React from 'react';

const experiment = (): React.JSX.Element => {
  //Display relevant experiment data
  //When Edit button is clicked take to Config experiment page
  return (
    <div className="flex gap-4">
      <p>Experiment Name</p>
      <button className="btn btn-success">Edit</button>
    </div>
  );
};

export default experiment;
