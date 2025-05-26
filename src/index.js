// src/index.js (or your main entry point)
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Assuming you have this for Tailwind base styles etc.
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Wrap App with BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);