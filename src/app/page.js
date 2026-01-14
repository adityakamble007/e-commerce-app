"use client";

import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function Home() {
  const featuredProducts = [
    {
      id: 1,
      title: "Premium Wireless Headphones",
      price: "299.99",
      originalPrice: "399.99",
      description: "Immersive sound with active noise cancellation",
      rating: 4.8,
      reviews: 256,
      badge: "Best Seller",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    },
    {
      id: 2,
      title: "Smart Watch Pro",
      price: "449.99",
      originalPrice: "549.99",
      description: "Track your fitness goals with precision",
      rating: 4.6,
      reviews: 189,
      badge: "New",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    },
    {
      id: 3,
      title: "Designer Sunglasses",
      price: "179.99",
      description: "UV protection with premium style",
      rating: 4.5,
      reviews: 143,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80",
    },
    {
      id: 4,
      title: "Leather Backpack",
      price: "189.99",
      originalPrice: "249.99",
      description: "Handcrafted genuine leather with laptop compartment",
      rating: 4.9,
      reviews: 312,
      badge: "20% OFF",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
    },
    {
      id: 5,
      title: "Minimalist Sneakers",
      price: "129.99",
      description: "Comfortable everyday wear with premium materials",
      rating: 4.7,
      reviews: 421,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80",
    },
    {
      id: 6,
      title: "Ceramic Coffee Mug Set",
      price: "49.99",
      originalPrice: "69.99",
      description: "Artisan crafted mugs for your morning ritual",
      rating: 4.4,
      reviews: 98,
      badge: "Limited",
      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80",
    },
    {
      id: 7,
      title: "Wireless Earbuds Elite",
      price: "159.99",
      description: "Crystal clear audio with 24-hour battery life",
      rating: 4.6,
      reviews: 567,
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80",
    },
    {
      id: 8,
      title: "Premium Denim Jacket",
      price: "219.99",
      originalPrice: "279.99",
      description: "Classic style meets modern comfort",
      rating: 4.8,
      reviews: 234,
      badge: "Trending",
      image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80",
    },
  ];

  const categories = [
    { name: "Electronics", icon: "💻", count: 1240 },
    { name: "Fashion", icon: "👗", count: 856 },
    { name: "Home & Living", icon: "🏠", count: 634 },
    { name: "Beauty", icon: "✨", count: 412 },
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-950 dark:to-violet-950" />

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-pink-300/20 rounded-full blur-2xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/50 dark:to-indigo-900/50 border border-violet-200 dark:border-violet-800 mb-6">
              <span className="animate-pulse w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                New Collection Available
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-violet-800 to-gray-900 dark:from-white dark:via-violet-300 dark:to-white bg-clip-text text-transparent">
                Discover Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Perfect Style
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Explore our curated collection of premium products. From the latest tech to timeless fashion, find everything you love in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-8 py-6 text-lg rounded-xl shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 hover:-translate-y-1">
                Shop Now
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
              <Button variant="outline" className="px-8 py-6 text-lg rounded-xl border-2 border-gray-300 dark:border-gray-700 hover:border-violet-500 dark:hover:border-violet-500 transition-all duration-300">
                View Collections
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {[
                { value: "50K+", label: "Happy Customers" },
                { value: "10K+", label: "Products" },
                { value: "99%", label: "Satisfaction" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
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
            <Button variant="outline" className="rounded-xl border-2 hover:border-violet-500 transition-colors">
              View All Products
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                image={product.image}
                title={product.title}
                price={product.price}
                originalPrice={product.originalPrice}
                description={product.description}
                rating={product.rating}
                reviews={product.reviews}
                badge={product.badge}
                onAddToCart={() => console.log(`Added ${product.title} to cart`)}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
