"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import AdminNavbar from "@/components/AdminNavbar";

/**
 * Product List Admin Page
 * Displays all products from the database in a responsive grid layout
 */
export default function ProductListAdmin() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Fetch products from the API
     */
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

    /**
     * Format price with currency symbol
     */
    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price);
    };

    /**
     * Calculate discount percentage
     */
    const calculateDiscount = (price, originalPrice) => {
        if (!originalPrice || originalPrice <= price) return null;
        return Math.round(((originalPrice - price) / originalPrice) * 100);
    };

    return (
        <>
            <AdminNavbar />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-950 relative overflow-hidden pt-16">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-950 dark:to-violet-950" />

                {/* Decorative Elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-violet-400/30 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
                <div className="absolute top-40 right-20 w-48 h-48 bg-pink-300/20 rounded-full blur-2xl" />

                <div className="relative min-h-screen px-4 py-12">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-12">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/50 dark:to-indigo-900/50 border border-violet-200 dark:border-violet-800 mb-6">
                                <span className="animate-pulse w-2 h-2 rounded-full bg-green-500" />
                                <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                                    Admin Panel
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                <span className="bg-gradient-to-r from-gray-900 via-violet-800 to-gray-900 dark:from-white dark:via-violet-300 dark:to-white bg-clip-text text-transparent">
                                    Product List
                                </span>
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                Manage your store catalog
                            </p>

                            {/* Product Count */}
                            {!isLoading && !error && (
                                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                    {products.length} product
                                    {products.length !== 1 ? "s" : ""} found
                                </div>
                            )}
                        </div>

                        {/* Loading State */}
                        {isLoading && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {[...Array(8)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-pulse"
                                    >
                                        <div className="h-48 bg-gray-200 dark:bg-gray-700" />
                                        <div className="p-4 space-y-3">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Error State */}
                        {error && !isLoading && (
                            <div className="max-w-md mx-auto text-center">
                                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-red-500/10 border border-red-200 dark:border-red-800 p-8">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                        <svg
                                            className="w-8 h-8 text-red-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        Failed to Load Products
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        {error}
                                    </p>
                                    <Button
                                        onClick={fetchProducts}
                                        className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/30"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                            />
                                        </svg>
                                        Try Again
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && !error && products.length === 0 && (
                            <div className="max-w-md mx-auto text-center">
                                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-violet-500/10 border border-gray-200 dark:border-gray-800 p-8">
                                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/50 dark:to-indigo-900/50 flex items-center justify-center">
                                        <svg
                                            className="w-10 h-10 text-violet-600 dark:text-violet-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        No Products Yet
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        Start adding products to see them here
                                    </p>
                                    <a href="/productUpload">
                                        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300">
                                            <svg
                                                className="w-4 h-4 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 4v16m8-8H4"
                                                />
                                            </svg>
                                            Add Your First Product
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Product Grid */}
                        {!isLoading && !error && products.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map((product) => {
                                    const discount = calculateDiscount(
                                        product.price,
                                        product.original_price
                                    );

                                    return (
                                        <div
                                            key={product.id}
                                            className="group bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 hover:shadow-xl hover:shadow-violet-500/20 transition-all duration-300 hover:-translate-y-1"
                                        >
                                            {/* Product Image */}
                                            <div className="relative h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                                {product.image_url ? (
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <svg
                                                            className="w-12 h-12 text-gray-300 dark:text-gray-600"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}

                                                {/* Discount Badge */}
                                                {discount && (
                                                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                                                        -{discount}%
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="p-4">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                                    {product.title}
                                                </h3>

                                                {/* Price */}
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                                                        {formatPrice(
                                                            product.price
                                                        )}
                                                    </span>
                                                    {product.original_price &&
                                                        product.original_price >
                                                        product.price && (
                                                            <span className="text-sm text-gray-400 line-through">
                                                                {formatPrice(
                                                                    product.original_price
                                                                )}
                                                            </span>
                                                        )}
                                                </div>

                                                {/* Description */}
                                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                    {product.description}
                                                </p>

                                                {/* Created Date */}
                                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                                        Added{" "}
                                                        {new Date(
                                                            product.created_at
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Refresh Button */}
                        {!isLoading && !error && products.length > 0 && (
                            <div className="text-center mt-12">
                                <Button
                                    onClick={fetchProducts}
                                    variant="outline"
                                    className="border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        />
                                    </svg>
                                    Refresh Products
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
