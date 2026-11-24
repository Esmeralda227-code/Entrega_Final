import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { EventosProvider } from './assets/Context/EventosContext.jsx';
import { SesionProvider } from './assets/Context/SesionContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SesionProvider>
      <EventosProvider>
        <App />
      </EventosProvider>
    </SesionProvider>
  </StrictMode>
);