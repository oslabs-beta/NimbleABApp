import React from 'react';
import { ReactDOM } from 'react';
import { Root, createRoot } from 'react-dom/client';
import './css/styles.css';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './core/App';

const element = document.getElementById('target');
const root = createRoot(element);

root.render(<App></App>);
