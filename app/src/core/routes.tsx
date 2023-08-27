import React from 'react';
import { Routes, Route } from 'react-router';
import { paths, pathNames } from '../constants/routes.js';
import loadable from '@loadable/component';

// Load bundles asynchronously so that the initial render happens faster

//To be replaced with our different pages
const Home = loadable(
  () => import(/* webpackChunkName: "WelcomeChunk" */ '../pages/home/home')
);

const AppRoutes = (): React.JSX.Element => {
  return (
    <Routes>
      <Route path={pathNames.HOME} element={<Home />}></Route>
    </Routes>
  );
};

export default AppRoutes;
