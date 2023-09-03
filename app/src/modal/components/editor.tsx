import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

const Editors = (): React.JSX.Element => {
  const [fileName, setFileName] = useState('../index.js');

  //Grab file from state in redux
  //send an event to IPC to grab the file text
  //set state of fileText to text
  //add value to editor
  //create an onChange functions that updates text state to new updated text
  //Create Save button and save menu item to save the modal;

  return (
    <div className="h-full w-screen bg-primary">
      <h1 className="text-white">Loaded the modal</h1>
      <Editor
        language="javascript"
        height="100vh"
        width="90vh"
        theme="vs-dark"
      />
    </div>
  );
};

export default Editors;
