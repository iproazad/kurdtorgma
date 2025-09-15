import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App';
import './src/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// AI Studio always uses an `index.tsx` file for all project types.
