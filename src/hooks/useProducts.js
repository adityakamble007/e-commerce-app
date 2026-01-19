"use client";

import useSWR from "swr";

// Fetcher function for SWR
const fetcher = (url) => fetch(url).then((res) => res.json());

/**
 * Custom hook to fetch products from the API with SWR caching
 * Products are cached and shared across all components
 * @returns {Object} { products, isLoading, error, refetch }
 */
export function useProducts() {
    const { data, error, isLoading, mutate } = useSWR("/api/products", fetcher, {
        revalidateOnFocus: false,    // Don't refetch on window focus
        dedupingInterval: 60000,      // Dedupe requests within 1 minute
        revalidateOnReconnect: false, // Don't refetch on reconnect
    });

    return {
        products: data?.products || [],
        isLoading,
        error: error?.message || data?.error || null,
        refetch: mutate,
    };
}
