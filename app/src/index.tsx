import React, { Suspense } from 'react';
import { Root, createRoot } from 'react-dom/client';
import { store, history } from './redux/store';
import './css/styles.css';
import App from './core/App';

const element = document.getElementById('target');
const root: Root = createRoot(element!);

root.render(
  <Suspense fallback="loading">
    <App store={store} history={history}></App>
  </Suspense>
);
