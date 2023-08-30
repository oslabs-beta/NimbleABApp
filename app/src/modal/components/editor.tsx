import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

const Editors = (): React.JSX.Element => {
  const [fileName, setFileName] = useState('../index.js');
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
