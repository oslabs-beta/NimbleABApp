import React from 'react';
import { Root, createRoot } from 'react-dom/client';
import './css/styles.css';
import App from './core/App';

const element = document.getElementById('target');
const root: Root = createRoot(element!);

root.render(<App></App>);
