"use client";

import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * Your Orders Page
 * Displays completed orders after payment
 */
export default function OrdersPage() {
    const { user, isLoaded } = useUser();

    // Static demo orders data
    const orders = [
        {
            id: "ORD-2026-001",
            date: "January 17, 2026",
            status: "Delivered",
            statusColor: "green",
            total: 299.99,
            items: [
                {
                    name: "Sony WH-1000XM5 Headphones",
                    quantity: 1,
                    price: 279.99,
                    image: "https://utfs.io/f/placeholder-headphones.jpg",
                },
                {
                    name: "Premium Ceramic Mug",
                    quantity: 1,
                    price: 19.99,
                    image: "https://utfs.io/f/placeholder-mug.jpg",
                },
            ],
        },
        {
            id: "ORD-2026-002",
            date: "January 15, 2026",
            status: "Shipped",
            statusColor: "blue",
            total: 149.99,
            items: [
                {
                    name: "Nike Air Max Sneakers",
                    quantity: 1,
                    price: 149.99,
                    image: "https://utfs.io/f/placeholder-shoes.jpg",
                },
            ],
        },
        {
            id: "ORD-2026-003",
            date: "January 10, 2026",
            status: "Delivered",
            statusColor: "green",
            total: 89.99,
            items: [
                {
                    name: "Wireless Charging Pad",
                    quantity: 2,
                    price: 44.99,
                    image: "https://utfs.io/f/placeholder-charger.jpg",
                },
            ],
        },
    ];

    const getStatusStyles = (color) => {
        switch (color) {
            case "green":
                return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
            case "blue":
                return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
            case "yellow":
                return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400";
            default:
                return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400";
        }
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-950 relative overflow-hidden pt-16">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-950 dark:to-violet-950" />

                {/* Decorative Elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-violet-400/30 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
                <div className="absolute top-40 right-20 w-48 h-48 bg-pink-300/20 rounded-full blur-2xl" />

                <div className="relative min-h-screen px-4 py-12">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-12">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/50 dark:to-indigo-900/50 border border-violet-200 dark:border-violet-800 mb-6">
                                <svg
                                    className="w-4 h-4 text-violet-600 dark:text-violet-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                                <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                                    Order History
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                <span className="bg-gradient-to-r from-gray-900 via-violet-800 to-gray-900 dark:from-white dark:via-violet-300 dark:to-white bg-clip-text text-transparent">
                                    Your Orders
                                </span>
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                {isLoaded && user
                                    ? `Welcome back, ${user.firstName || "there"}! Here are your recent orders.`
                                    : "Track and manage your orders"}
                            </p>
                        </div>

                        {/* Orders List */}
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-violet-500/5 border border-gray-200/50 dark:border-gray-800/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                                >
                                    {/* Order Header */}
                                    <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-800/30">
                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Order ID
                                                    </p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        {order.id}
                                                    </p>
                                                </div>
                                                <div className="hidden sm:block w-px h-10 bg-gray-200 dark:bg-gray-700" />
                                                <div className="hidden sm:block">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Placed on
                                                    </p>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {order.date}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span
                                                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusStyles(
                                                        order.statusColor
                                                    )}`}
                                                >
                                                    {order.status}
                                                </span>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Total
                                                    </p>
                                                    <p className="font-bold text-lg text-violet-600 dark:text-violet-400">
                                                        ${order.total.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            {order.items.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-4"
                                                >
                                                    {/* Placeholder Image */}
                                                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                                        <svg
                                                            className="w-8 h-8 text-violet-400"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={1.5}
                                                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                                            {item.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            Qty: {item.quantity}
                                                        </p>
                                                    </div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        ${item.price.toFixed(2)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Order Actions */}
                                    <div className="px-6 py-4 border-t border-gray-200/50 dark:border-gray-800/50 bg-gray-50/30 dark:bg-gray-800/20">
                                        <div className="flex flex-wrap gap-3">
                                            <button className="px-4 py-2 text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors">
                                                View Details
                                            </button>
                                            <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                                Track Order
                                            </button>
                                            {order.status === "Delivered" && (
                                                <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                                    Leave Review
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Empty State (hidden for demo, can be shown when no orders) */}
                        {orders.length === 0 && (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                                    <svg
                                        className="w-12 h-12 text-violet-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    No orders yet
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    When you complete a purchase, your orders will appear here.
                                </p>
                                <a
                                    href="/products"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    Start Shopping
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                        />
                                    </svg>
                                </a>
                            </div>
                        )}

                        {/* Summary Stats */}
                        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-violet-500/5 border border-gray-200/50 dark:border-gray-800/50 p-6 text-center">
                                <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                                    {orders.length}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Total Orders
                                </p>
                            </div>
                            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-violet-500/5 border border-gray-200/50 dark:border-gray-800/50 p-6 text-center">
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                    {orders.filter((o) => o.status === "Delivered").length}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Delivered
                                </p>
                            </div>
                            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-violet-500/5 border border-gray-200/50 dark:border-gray-800/50 p-6 text-center">
                                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                                    ${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Total Spent
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
