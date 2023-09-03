import React from 'react';

import AppRoutes from './routes';
import { HashRouter } from 'react-router-dom';
import Nav from './nav';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
// import TestingConfig from "../pages/config/Config";

const App = () => {
  return (
    <>
      <Provider store={store}>
        <HashRouter>
          <Nav></Nav>
          <AppRoutes></AppRoutes>
        </HashRouter>
      </Provider>
    </>
  );
};
export default App;
