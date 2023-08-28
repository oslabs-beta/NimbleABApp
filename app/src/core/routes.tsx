import React from "react";
import { Routes, Route } from "react-router";
import { pathNames } from "../constants/routes";
import loadable from "@loadable/component";
import { BrowserRouter } from "react-router-dom";

// Load bundles asynchronously so that the initial render happens faster

//To be replaced with our different pages
const Home = loadable(
  () => import(/* webpackChunkName: "WelcomeChunk" */ "../pages/home/home")
);

const TestingConfig = loadable(() => import("../pages/config/TestingConfig"));

const AppRoutes = (): React.JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={pathNames.HOME} element={<Home />}></Route>
        <Route
          path={pathNames.TESTINGCONFIG}
          element={<TestingConfig />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
