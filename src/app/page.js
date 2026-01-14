"use client";

import { useMemo, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";
import { ErrorState, EmptyState } from "@/components/FeedbackStates";

export default function Home() {
  const { products, isLoading, error, refetch } = useProducts();

  // Memoize static categories data
  const categories = useMemo(
    () => [
      { name: "Electronics", icon: "💻", count: 1240 },
      { name: "Fashion", icon: "👗", count: 856 },
      { name: "Home & Living", icon: "🏠", count: 634 },
      { name: "Beauty", icon: "✨", count: 412 },
    ],
    [],
  );

  // Memoize add to cart handler
  const handleAddToCart = useCallback((title) => {
    console.log(`Added ${title} to cart`);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      {/* Categories Section */}
      <section className="pt-24 py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Browse through our most popular categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <a
                key={category.name}
                href="#"
                className="group relative p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 hover:from-violet-50 hover:to-indigo-50 dark:hover:from-violet-900/30 dark:hover:to-indigo-900/30 border border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {category.count} items
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="products" className="py-20 bg-gray-50 dark:bg-gray-950">
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
                  onAddToCart={() => handleAddToCart(product.title)}
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
