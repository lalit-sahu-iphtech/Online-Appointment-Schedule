// src/components/Toast/ToastContainer.jsx
import React from 'react';
import ToastItem from './ToastItem';
import './toast.css';

const ToastContainer = ({ toasts, removeToast }) => {
  console.log('📦 ToastContainer - toasts count:', toasts.length);
  
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => {
            console.log('🗑️ Removing toast from container:', toast.id);
            removeToast(toast.id);
          }}
        />
      ))}
    </div>
  );
};

export default ToastContainer;