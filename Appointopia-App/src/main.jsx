// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppointmentProvider } from './context/AppointmentContext';
import './index.css';
import { NotificationProvider } from './context/NotificationContext';
import { ToastProvider } from './component/Toast'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>  {/* ✅ Sabse outer */}
        <NotificationProvider>
          <AppointmentProvider>
            <App />
          </AppointmentProvider>
        </NotificationProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);