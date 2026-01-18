"use client";

import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";
import { ErrorState, EmptyState } from "@/components/FeedbackStates";
import Card from "@/components/Card";

/**
 * Product List Admin Page
 * Displays all products from the database in a responsive grid layout
 */
export default function ProductListAdmin() {
    const { products, isLoading, error, refetch } = useProducts();

    /**
     * Calculate discount percentage
     */
    const calculateDiscount = (price, originalPrice) => {
        if (!originalPrice || originalPrice <= price) return null;
        return `${Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF`;
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-950 dark:to-violet-950" />

            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-violet-400/30 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
            <div className="absolute top-40 right-20 w-48 h-48 bg-pink-300/20 rounded-full blur-2xl" />

            <div className="relative min-h-screen px-4 py-8 md:py-12">
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
                    {isLoading && <ProductGridSkeleton count={8} />}

                    {/* Error State */}
                    {error && !isLoading && (
                        <div className="py-12">
                            <ErrorState error={error} onRetry={refetch} />
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && !error && products.length === 0 && (
                        <div className="py-12">
                            <EmptyState
                                actionLabel="Add Your First Product"
                                actionLink="/admin/products/upload"
                            />
                        </div>
                    )}

                    {/* Product Grid */}
                    {!isLoading && !error && products.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <Card
                                    key={product.id}
                                    image={product.image_url}
                                    title={product.title}
                                    price={product.price}
                                    originalPrice={product.original_price}
                                    description={product.description}
                                    showAddToCart={false}
                                    badge={calculateDiscount(product.price, product.original_price)}
                                    extraContent={
                                        <span className="text-xs text-gray-400 dark:text-gray-500">
                                            Added{" "}
                                            {new Date(
                                                product.created_at
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </span>
                                    }
                                />
                            ))}
                        </div>
                    )}

                    {/* Refresh Button */}
                    {!isLoading && !error && products.length > 0 && (
                        <div className="text-center mt-12">
                            <Button
                                onClick={refetch}
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
        </div>
    );
}
