import React from 'react';
import { createRoot } from 'react-dom/client';
import '../css/styles.css';
import Loading from './components/loading';
const element = document.getElementById('target');
const root = createRoot(element);

root.render(<Loading></Loading>);

