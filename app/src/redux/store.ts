import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { createHashHistory } from 'history';
import { createReduxHistoryContext } from 'redux-first-history';
import undoable from 'easy-redux-undo';

//All code under here needs to be tailored to our app
import homeReducer from '../components/home/homeSlice';
import counterReducer from '../components/counter/counterSlice';
import complexReducer from '../components/complex/complexSlice';

const { routerMiddleware, createReduxHistory, routerReducer } =
  createReduxHistoryContext({
    history: createHashHistory(),
  });

export const store = configureStore({
  reducer: combineReducers({
    router: routerReducer,
    home: homeReducer,
    undoable: undoable(
      combineReducers({
        counter: counterReducer,
        complex: complexReducer,
      })
    ),
  }),
  middleware: [routerMiddleware],
});

export const history = createReduxHistory(store);
