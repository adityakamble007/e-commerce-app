"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useProducts } from "@/hooks/useProducts";

/**
 * Admin Dashboard Page
 * Dynamic overview with real-time stats from orders and products data
 */
export default function AdminDashboard() {
    const { user } = useUser();
    const { products, isLoading: productsLoading } = useProducts();
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);

    // Fetch orders data
    const fetchOrders = useCallback(async () => {
        try {
            setOrdersLoading(true);
            const response = await fetch("/api/admin/orders");
            const data = await response.json();
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setOrdersLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Calculate dynamic stats from orders
    const stats = {
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0),
        processing: orders.filter((o) => o.status === "processing").length,
        shipping: orders.filter((o) => o.status === "shipping").length,
        delivered: orders.filter((o) => o.status === "delivered").length,
    };

    // Get recent orders (last 5)
    const recentOrders = [...orders]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case "delivered":
                return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
            case "shipping":
                return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
            case "processing":
                return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400";
            default:
                return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400";
        }
    };

    const quickActions = [
        {
            name: "Upload Product",
            description: "Add a new product to your store",
            href: "/admin/products/upload",
            icon: (
                <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                </svg>
            ),
            color: "from-violet-500 to-purple-600",
        },
        {
            name: "View Products",
            description: "Manage your product catalog",
            href: "/admin/products",
            icon: (
                <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                </svg>
            ),
            color: "from-indigo-500 to-blue-600",
        },
        {
            name: "Manage Orders",
            description: "View and update order statuses",
            href: "/admin/orders",
            icon: (
                <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                </svg>
            ),
            color: "from-amber-500 to-orange-600",
        },
    ];

    const isLoading = productsLoading || ordersLoading;

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-950 dark:to-violet-950" />

            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-violet-400/30 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />

            <div className="relative px-4 py-8 md:py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Welcome Header */}
                    <div className="mb-10">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/50 dark:to-indigo-900/50 border border-violet-200 dark:border-violet-800 mb-6">
                            <span className="animate-pulse w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                                Admin Dashboard
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            <span className="bg-gradient-to-r from-gray-900 via-violet-800 to-gray-900 dark:from-white dark:via-violet-300 dark:to-white bg-clip-text text-transparent">
                                Welcome back, {user?.firstName || "Admin"}
                            </span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Manage your store from here
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        {/* Total Revenue */}
                        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-violet-500/5 border border-gray-200/50 dark:border-gray-800/50 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Total Revenue
                                    </p>
                                    <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                        {isLoading ? (
                                            <span className="inline-block w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                        ) : (
                                            `$${stats.totalRevenue.toFixed(2)}`
                                        )}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Total Orders */}
                        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-violet-500/5 border border-gray-200/50 dark:border-gray-800/50 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Total Orders
                                    </p>
                                    <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                        {isLoading ? (
                                            <span className="inline-block w-12 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                        ) : (
                                            stats.totalOrders
                                        )}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Total Products */}
                        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-violet-500/5 border border-gray-200/50 dark:border-gray-800/50 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Total Products
                                    </p>
                                    <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                        {productsLoading ? (
                                            <span className="inline-block w-12 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                        ) : (
                                            products.length
                                        )}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 text-white"
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
                            </div>
                        </div>

                        {/* Pending Orders */}
                        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-violet-500/5 border border-gray-200/50 dark:border-gray-800/50 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Pending Orders
                                    </p>
                                    <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                        {isLoading ? (
                                            <span className="inline-block w-12 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                        ) : (
                                            stats.processing + stats.shipping
                                        )}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Status Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                        {/* Processing */}
                        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Processing</p>
                                    <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                                        {ordersLoading ? "..." : stats.processing}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Shipping */}
                        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Shipping</p>
                                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                        {ordersLoading ? "..." : stats.shipping}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Delivered */}
                        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Delivered</p>
                                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                                        {ordersLoading ? "..." : stats.delivered}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Recent Orders
                            </h2>
                            <Link
                                href="/admin/orders"
                                className="text-sm text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
                            >
                                View All
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>

                        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
                            {ordersLoading ? (
                                <div className="p-6 space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center gap-4 animate-pulse">
                                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                                            <div className="flex-1">
                                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
                                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                            </div>
                                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                                        </div>
                                    ))}
                                </div>
                            ) : recentOrders.length === 0 ? (
                                <div className="p-12 text-center">
                                    <svg
                                        className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
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
                                    <p className="text-gray-500 dark:text-gray-400">No orders yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200/50 dark:divide-gray-800/50">
                                    {recentOrders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="flex items-center justify-between p-4 hover:bg-violet-50/50 dark:hover:bg-violet-900/10 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                                                    #{order.order_number?.slice(-3) || "---"}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        {order.order_number}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {order.items?.length || 0} items • {formatDate(order.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <p className="font-semibold text-violet-600 dark:text-violet-400">
                                                    ${parseFloat(order.total).toFixed(2)}
                                                </p>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(order.status)}`}
                                                >
                                                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {quickActions.map((action) => (
                            <Link
                                key={action.name}
                                href={action.href}
                                className="group bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-violet-500/5 border border-gray-200/50 dark:border-gray-800/50 p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                        {action.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                            {action.name}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            {action.description}
                                        </p>
                                    </div>
                                    <svg
                                        className="w-5 h-5 text-gray-400 group-hover:text-violet-600 transition-all group-hover:translate-x-1"
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
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
