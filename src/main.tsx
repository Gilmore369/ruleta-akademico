import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Punto de entrada de la aplicación. Renderizamos el componente
// de alto nivel <App /> dentro del elemento con id "root".
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
