import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { SubmissionsProvider } from './context/SubmissionsContext.jsx';
import { ContentProvider } from './context/ContentContext.jsx';
import { MonevProvider } from './context/MonevContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ContentProvider>
            <SubmissionsProvider>
              <MonevProvider>
                <App />
              </MonevProvider>
            </SubmissionsProvider>
          </ContentProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
