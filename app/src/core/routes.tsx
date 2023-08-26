import React from 'react';
import { Routes, Route } from 'react-router';
import { paths, pathNames } from '../constants/routes.js';
import loadable from '@loadable/component';

// Load bundles asynchronously so that the initial render happens faster

//To be replaced with our different pages
const Config = loadable(
  () =>
    import(/* webpackChunkName: "WelcomeChunk" */ '../pages/config/Config.js')
);

const AppRoutes = (): React.JSX.Element => {
  return (
    <Routes>
      <Route path={pathNames.WELCOME} element={<Welcome />}></Route>
      <Route path={pathNames.ABOUT} element={<About />}></Route>
      <Route path={pathNames.MOTD} element={<Motd />}></Route>
      <Route path={pathNames.LOCALIZATION} element={<Localization />}></Route>
      <Route path={pathNames.UNDOREDO} element={<UndoRedo />}></Route>
      <Route path={pathNames.CONTEXTMENU} element={<ContextMenu />}></Route>
      <Route path={pathNames.IMAGE} element={<Image />}></Route>
    </Routes>
  );
};
