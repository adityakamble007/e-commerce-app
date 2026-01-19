"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/Toast";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";
import { ErrorState, EmptyState } from "@/components/FeedbackStates";

export default function Home() {
  const { products, isLoading, error, refetch } = useProducts();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [addingProductId, setAddingProductId] = useState(null);



  // Add to cart handler with animation
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

      {/* Featured Products Section */}
      <section id="products" className="pt-24 py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Handpicked items just for you
              </p>
            </div>
            <Link href="/products" prefetch={true}>
              <Button
                variant="outline"
                className="rounded-xl border-2 hover:border-violet-500 transition-colors"
              >
                View All Products
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            </Link>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
