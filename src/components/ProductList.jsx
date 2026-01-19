"use client";

import { useCallback, useState } from "react";
import Card from "@/components/Card";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/Toast";
import { EmptyState } from "@/components/FeedbackStates";

export default function ProductList({ initialProducts = [] }) {
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
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        {initialProducts.length} product{initialProducts.length !== 1 ? "s" : ""} available
                    </p>
                </div>

                {/* Empty State */}
                {initialProducts.length === 0 && (
                    <div className="py-12">
                        <EmptyState />
                    </div>
                )}

                {/* Products Grid */}
                {initialProducts.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {initialProducts.map((product) => (
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
    );
}
