// src/components/Toast/ToastContainer.jsx
import React from 'react';
import ToastItem from './ToastItem';
import './toast.css';

const ToastContainer = ({ toasts, removeToast }) => {
  
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => {
            removeToast(toast.id);
          }}
        />
      ))}
    </div>
  );
};

export default ToastContainer;