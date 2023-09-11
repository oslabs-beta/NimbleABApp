import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';

const Editors = (): React.JSX.Element => {
  const [filePath, setFilePath] = useState('');
  const [fileText, setFileText] = useState('')
  const textRef = useRef('')

  const handleEditorChange = (editor:any, monaco:any) => {
    textRef.current = editor 
  }

  const handleClose = () => {
    window.electronAPI.closeFile({data: textRef.current, filePath});
  }


  //Receives file to load from Main Proccess
  window.electronAPI.loadFile((_event:any, value:any)=>{
    const {data, filePath} = value;
    setFilePath(filePath);
    setFileText(new TextDecoder().decode(data));
    textRef.current = new TextDecoder().decode(data);
  })

  //Talks with main proccess to Save updated Text
  window.electronAPI.saveFile((_event:any, value:any)=>{
    console.log("Saving")
    _event.sender.send('save-file',{data: textRef.current, filePath})
    setFileText(fileText)
  })

  return (

    <div className="h-screen w-screen bg-primary flex flex-col">
      <h1 className="text-white text-lg font-bold self-center">Variant Editor</h1>
      <Editor
        language="javascript"
        height="85vh"
        width="100"
        theme="vs-dark"
        value={fileText}
        onChange={handleEditorChange}
        options={{minimap:{enabled:false}}}
      />
      <button onClick={handleClose} className='btn btn-success grow'>Close and Save</button>
    </div>
    

  );
};

export default Editors;
