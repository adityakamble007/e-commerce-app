"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";

// Generate or retrieve guest session ID
function getSessionId() {
    if (typeof window === "undefined") return null;

    let sessionId = localStorage.getItem("cart_session_id");
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem("cart_session_id", sessionId);
    }
    return sessionId;
}

/**
 * Custom hook for cart state management
 * Supports both guest and logged-in users
 * Automatically merges guest cart on login
 * 
 * @returns {Object} Cart state and actions
 */
export function useCart() {
    const [items, setItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { isSignedIn, isLoaded } = useAuth();
    const prevSignedInRef = useRef(null);
    const hasMergedRef = useRef(false);

    // Get session ID for API calls
    const getHeaders = useCallback(() => {
        const sessionId = getSessionId();
        const headers = {
            "Content-Type": "application/json",
        };
        if (sessionId && !isSignedIn) {
            headers["x-session-id"] = sessionId;
        }
        return headers;
    }, [isSignedIn]);

    // Fetch cart items
    const fetchCart = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const sessionId = getSessionId();
            const headers = {};
            if (sessionId && !isSignedIn) {
                headers["x-session-id"] = sessionId;
            }

            const response = await fetch("/api/cart", { headers });
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || "Failed to fetch cart");
            }

            setItems(data.items || []);
            setCartCount(data.cartCount || 0);
        } catch (err) {
            console.error("❌ Failed to fetch cart:", err);
            setError(err.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }, [isSignedIn]);

    // Merge guest cart on login
    const mergeGuestCart = useCallback(async () => {
        const sessionId = getSessionId();
        if (!sessionId) return;

        try {
            const response = await fetch("/api/cart/merge", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId }),
            });

            const data = await response.json();

            if (data.success && data.mergedCount > 0) {
                console.log(`✅ Merged ${data.mergedCount} items from guest cart`);
            }

            // Clear guest session after merge
            localStorage.removeItem("cart_session_id");
        } catch (err) {
            console.error("❌ Failed to merge guest cart:", err);
        }
    }, []);

    // Add item to cart
    const addToCart = useCallback(async (productId, quantity = 1) => {
        try {
            const response = await fetch("/api/cart", {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify({ productId, quantity }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || "Failed to add to cart");
            }

            // Refetch cart to get updated state
            await fetchCart();
            return { success: true };
        } catch (err) {
            console.error("❌ Failed to add to cart:", err);
            setError(err.message);
            return { success: false, error: err.message };
        }
    }, [getHeaders, fetchCart]);

    // Update item quantity
    const updateQuantity = useCallback(async (itemId, quantity) => {
        try {
            const response = await fetch("/api/cart", {
                method: "PATCH",
                headers: getHeaders(),
                body: JSON.stringify({ itemId, quantity }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || "Failed to update quantity");
            }

            // Optimistic update
            setItems(prev =>
                prev.map(item =>
                    item.id === itemId ? { ...item, quantity } : item
                )
            );
            setCartCount(prev => {
                const item = items.find(i => i.id === itemId);
                if (!item) return prev;
                return prev - item.quantity + quantity;
            });

            return { success: true };
        } catch (err) {
            console.error("❌ Failed to update quantity:", err);
            setError(err.message);
            // Refetch on error to sync state
            await fetchCart();
            return { success: false, error: err.message };
        }
    }, [getHeaders, items, fetchCart]);

    // Remove item from cart
    const removeFromCart = useCallback(async (itemId) => {
        try {
            const response = await fetch(`/api/cart?itemId=${itemId}`, {
                method: "DELETE",
                headers: getHeaders(),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || "Failed to remove from cart");
            }

            // Optimistic update
            const removedItem = items.find(i => i.id === itemId);
            setItems(prev => prev.filter(item => item.id !== itemId));
            if (removedItem) {
                setCartCount(prev => prev - removedItem.quantity);
            }

            return { success: true };
        } catch (err) {
            console.error("❌ Failed to remove from cart:", err);
            setError(err.message);
            await fetchCart();
            return { success: false, error: err.message };
        }
    }, [getHeaders, items, fetchCart]);

    // Clear entire cart
    const clearCart = useCallback(async () => {
        try {
            const response = await fetch("/api/cart?clear=true", {
                method: "DELETE",
                headers: getHeaders(),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || "Failed to clear cart");
            }

            setItems([]);
            setCartCount(0);

            return { success: true };
        } catch (err) {
            console.error("❌ Failed to clear cart:", err);
            setError(err.message);
            return { success: false, error: err.message };
        }
    }, [getHeaders]);

    // Handle auth state changes and initial load
    useEffect(() => {
        if (!isLoaded) return;

        // Detect login transition (guest -> signed in)
        if (prevSignedInRef.current === false && isSignedIn && !hasMergedRef.current) {
            hasMergedRef.current = true;
            mergeGuestCart().then(() => fetchCart());
        } else {
            fetchCart();
        }

        prevSignedInRef.current = isSignedIn;
    }, [isLoaded, isSignedIn, fetchCart, mergeGuestCart]);

    return {
        items,
        cartCount,
        isLoading,
        error,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refetch: fetchCart,
    };
}
