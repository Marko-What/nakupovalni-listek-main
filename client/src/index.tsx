import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // Make sure App is a .tsx file with proper TypeScript setup
import reportWebVitals from './reportWebVitals'; // Ensure reportWebVitals is adapted for TypeScript, if it contains custom logic

// Ensure your root element is correctly typed, which helps prevent runtime errors
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// ReactDOM.createRoot() expects the root element to be non-null, ensured above
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// The same as before, since this doesn't inherently change with TypeScript
reportWebVitals();
