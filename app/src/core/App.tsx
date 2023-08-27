import React from 'react';
import { HistoryRouter } from 'redux-first-history/rr6';
const App: React.FC = () => {
  return (
    <>
      <Provider store={store}>
        <HistoryRouter history={history}></HistoryRouter>
      </Provider>
    </>
  );
};
export default App;
