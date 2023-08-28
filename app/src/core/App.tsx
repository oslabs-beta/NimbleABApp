import React from 'react';
import { HistoryRouter } from 'redux-first-history/rr6';
import AppRoutes from './routes';
import { BrowserRouter } from 'react-router-dom';
import Nav from './nav';
// import { Store } from 'redux';

const App = () => {
  return (
    <>
      {/* <Provider store={store}> */}
      <Nav></Nav>
      <AppRoutes></AppRoutes>

      {/* </Provider> */}
    </>
  );
};
export default App;
