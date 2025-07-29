// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './router/AppRouter';
import './index.css';

import Modal from 'react-modal'; // ✅ Add this import
Modal.setAppElement('#root');   // ✅ Register root app element for accessibility

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);