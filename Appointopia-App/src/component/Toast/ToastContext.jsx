// src/components/Toast/ToastContext.jsx
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import ToastContainer from './ToastContainer';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timeoutRefs = useRef({}); //  Store timeouts

  const removeToast = useCallback((id) => {
    
    //  Clear timeout if exists
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id]);
      delete timeoutRefs.current[id];
    }
    
    setToasts((prev) => {
      const newToasts = prev.filter((toast) => toast.id !== id);
      return newToasts;
    });
  }, []);

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type,
      title,
      message,
      duration,
      createdAt: Date.now(),
    };

    setToasts((prev) => {
      return [...prev, newToast];
    });

    // ✅ Set timeout for auto-remove
    if (duration > 0) {
      const timeoutId = setTimeout(() => {
        removeToast(id);
      }, duration);
      
      timeoutRefs.current[id] = timeoutId;
    }

    return id;
  }, [removeToast]);

  // Convenience methods
  const success = useCallback((title, message, duration = 4000) => {
    return addToast({ type: 'success', title, message, duration });
  }, [addToast]);

  const error = useCallback((title, message, duration = 5000) => {
    return addToast({ type: 'error', title, message, duration });
  }, [addToast]);

  const warning = useCallback((title, message, duration = 4000) => {
    return addToast({ type: 'warning', title, message, duration });
  }, [addToast]);

  const info = useCallback((title, message, duration = 4000) => {
    return addToast({ type: 'info', title, message, duration });
  }, [addToast]);

  const loading = useCallback((title, message) => {
    const id = addToast({ type: 'loading', title, message, duration: 0 });
    return {
      id,
      success: (newTitle, newMessage) => {
        // ✅ Clear old timeout and update toast
        if (timeoutRefs.current[id]) {
          clearTimeout(timeoutRefs.current[id]);
          delete timeoutRefs.current[id];
        }
        setToasts((prev) =>
          prev.map((toast) =>
            toast.id === id 
              ? { ...toast, type: 'success', title: newTitle, message: newMessage, duration: 3000 }
              : toast
          )
        );
        // ✅ Set new timeout for success
        const timeoutId = setTimeout(() => {
          removeToast(id);
        }, 3000);
        timeoutRefs.current[id] = timeoutId;
      },
      error: (newTitle, newMessage) => {
        if (timeoutRefs.current[id]) {
          clearTimeout(timeoutRefs.current[id]);
          delete timeoutRefs.current[id];
        }
        setToasts((prev) =>
          prev.map((toast) =>
            toast.id === id 
              ? { ...toast, type: 'error', title: newTitle, message: newMessage, duration: 5000 }
              : toast
          )
        );
        const timeoutId = setTimeout(() => {
          removeToast(id);
        }, 5000);
        timeoutRefs.current[id] = timeoutId;
      },
      dismiss: () => removeToast(id),
    };
  }, [addToast, removeToast]);

  const updateToast = useCallback((id, updates) => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id ? { ...toast, ...updates } : toast
      )
    );
  }, []);

  const clearAll = useCallback(() => {
    // ✅ Clear all timeouts
    Object.values(timeoutRefs.current).forEach(clearTimeout);
    timeoutRefs.current = {};
    setToasts([]);
  }, []);

  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    loading,
    updateToast,
    clearAll,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export default ToastProvider;