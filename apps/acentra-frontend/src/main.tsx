import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
import { TenantDetector } from './components/TenantDetector';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TenantDetector>
        <App />
      </TenantDetector>
    </BrowserRouter>
  </StrictMode>,
)
