import React from 'react';
import { createRoot } from 'react-dom/client';
import '../css/styles.css';
import Editor from './components/editor';
const element = document.getElementById('target');
const root = createRoot(element);

root.render(<Editor></Editor>);
