import React from 'react';
import { ReactDOM } from 'react';
import { Root, createRoot } from 'react-dom/client';

import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';

const element = document.getElementById('root');
const root: Root = createRoot(element!);

root.render(<App></App>);
