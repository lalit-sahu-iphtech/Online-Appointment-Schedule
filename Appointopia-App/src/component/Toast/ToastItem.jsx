// src/components/Toast/ToastItem.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaExclamationCircle, 
  FaInfoCircle,
  FaSpinner,
  FaTimes 
} from 'react-icons/fa';
import './toast.css';

const ToastItem = ({ toast, onRemove }) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [progress, setProgress] = useState(100);

  const icons = {
    success: <FaCheckCircle />,
    error: <FaTimesCircle />,
    warning: <FaExclamationCircle />,
    info: <FaInfoCircle />,
    loading: <FaSpinner />,
  };

  const handleClose = () => {
    console.log('❌ Manual close toast:', toast.id);
    setIsRemoving(true);
    setTimeout(onRemove, 300);
  };

  // Progress bar animation
  useEffect(() => {
    if (toast.duration > 0 && toast.type !== 'loading') {
      console.log(`📊 Progress started for toast: ${toast.id}, duration: ${toast.duration}ms`);
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / toast.duration) * 100);
        setProgress(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
        }
      }, 50);
      return () => {
        clearInterval(interval);
      };
    }
  }, [toast.duration, toast.id, toast.type]);

  return (
    <div className={`toast-item toast-${toast.type} ${isRemoving ? 'removing' : ''}`}>
      <div className={`toast-icon ${toast.type}`}>
        {icons[toast.type] || icons.info}
      </div>
      
      <div className="toast-content">
        {toast.title && <div className="toast-title">{toast.title}</div>}
        {toast.message && <div className="toast-message">{toast.message}</div>}
      </div>

      <button className="toast-close" onClick={handleClose}>
        <FaTimes />
      </button>

      {toast.duration > 0 && toast.type !== 'loading' && (
        <div className="toast-progress">
          <div 
            className="toast-progress-bar" 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default ToastItem;