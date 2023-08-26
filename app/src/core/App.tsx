import React from "react";

import { BrowserRouter, Routes, Router, Route } from "react-router-dom";
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <p className="bg-gray-500 text-center text-white">Hello World</p>
    </BrowserRouter>
  );
};
export default App;
