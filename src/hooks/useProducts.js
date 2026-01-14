"use client";

import { useState, useCallback, useEffect } from "react";

/**
 * Custom hook to fetch products from the API
 * @returns {Object} { products, isLoading, error, refetch }
 */
export function useProducts() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/products");
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || "Failed to fetch products");
            }

            setProducts(data.products || []);
        } catch (err) {
            console.error("❌ Failed to fetch products:", err);
            setError(err.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, isLoading, error, refetch: fetchProducts };
}
