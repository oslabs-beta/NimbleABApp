import React from 'react';

import AppRoutes from './routes';

import Nav from './nav';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
// import TestingConfig from "../pages/config/Config";

const App = () => {
  return (
    <>
      <Provider store={store}>
        <Nav></Nav>
        <AppRoutes></AppRoutes>
      </Provider>
    </>
  );
};
export default App;
