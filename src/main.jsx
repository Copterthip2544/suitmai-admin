// src/index.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';  // เปลี่ยนตรงนี้
import App from './App';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
