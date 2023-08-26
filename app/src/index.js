import React from 'react';
import { createRoot } from 'react-dom/client';
import './css/styles.css';
import App from './core/App';

const element = document.getElementById('target');
const root = createRoot(element);

root.render(<App></App>);
