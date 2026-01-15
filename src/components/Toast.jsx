"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

const ToastContext = createContext(null);

/**
 * Toast Notification Component
 * Displays animated notifications for cart actions
 */
function Toast({ message, type = "success", onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        cart: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
    };

    const colors = {
        success: "from-emerald-500 to-green-600",
        error: "from-rose-500 to-red-600",
        cart: "from-violet-500 to-indigo-600",
    };

    return (
        <div className="animate-slide-in-right">
            <div className={`
                flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl
                bg-gradient-to-r ${colors[type]} text-white
                backdrop-blur-sm border border-white/20
                transform transition-all duration-300
            `}>
                <span className="flex-shrink-0 p-1 bg-white/20 rounded-lg">
                    {icons[type]}
                </span>
                <p className="font-medium text-sm">{message}</p>
                <button
                    onClick={onClose}
                    className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

/**
 * Toast Container - displays all active toasts
 */
function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="fixed top-24 right-4 z-50 flex flex-col gap-3 pointer-events-none">
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                </div>
            ))}
        </div>
    );
}

/**
 * Toast Provider - wraps app to provide toast functionality
 */
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "success") => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

/**
 * Hook to use toast notifications
 */
export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        // Return no-op if used outside provider
        return { addToast: () => { } };
    }
    return context;
}
