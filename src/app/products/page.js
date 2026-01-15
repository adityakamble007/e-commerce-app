"use client";

import { useCallback, useState } from "react";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/Toast";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";
import { ErrorState, EmptyState } from "@/components/FeedbackStates";

/**
 * Products Page
 * Displays all products from the database in a grid layout
 */
export default function ProductsPage() {
    const { products, isLoading, error, refetch } = useProducts();
    const { addToCart } = useCart();
    const { addToast } = useToast();
    const [addingProductId, setAddingProductId] = useState(null);

    const handleAddToCart = useCallback(async (productId, productTitle) => {
        setAddingProductId(productId);
        const result = await addToCart(productId, 1);
        setAddingProductId(null);

        if (result.success) {
            addToast(`${productTitle} added to cart!`, "cart");
        } else {
            addToast("Failed to add item to cart", "error");
        }
    }, [addToCart, addToast]);

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />

            {/* Products Section */}
            <section className="pt-24 pb-20 relative overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-950 dark:to-violet-950" />

                {/* Decorative Elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-violet-400/30 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-gray-900 via-violet-800 to-gray-900 dark:from-white dark:via-violet-300 dark:to-white bg-clip-text text-transparent">
                                All Products
                            </span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                            Explore our curated collection of premium products
                        </p>
                        {!isLoading && !error && (
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                {products.length} product{products.length !== 1 ? "s" : ""} available
                            </p>
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
                            <EmptyState />
                        </div>
                    )}

                    {/* Products Grid */}
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
                                    onAddToCart={() => handleAddToCart(product.id, product.title)}
                                    isAdding={addingProductId === product.id}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
