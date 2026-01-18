"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

/**
 * Admin Orders Management Page
 * View all orders and update their status
 */
export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const [filter, setFilter] = useState("all");

    // Fetch orders
    const fetchOrders = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/admin/orders");
            const data = await response.json();

            if (data.success) {
                setOrders(data.orders);
            } else {
                setError(data.error);
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError("Failed to load orders");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Update order status
    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingOrderId(orderId);
        try {
            const response = await fetch(`/api/admin/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await response.json();

            if (data.success) {
                // Update local state
                setOrders((prev) =>
                    prev.map((order) =>
                        order.id === orderId ? { ...order, status: newStatus } : order
                    )
                );
            } else {
                alert("Failed to update status: " + data.error);
            }
        } catch (err) {
            console.error("Error updating order:", err);
            alert("Failed to update order status");
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case "delivered":
                return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800";
            case "shipping":
                return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800";
            case "processing":
                return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
            default:
                return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400";
        }
    };

    const formatStatus = (status) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Filter orders
    const filteredOrders = orders.filter((order) => {
        if (filter === "all") return true;
        return order.status === filter;
    });

    // Stats
    const stats = {
        total: orders.length,
        processing: orders.filter((o) => o.status === "processing").length,
        shipping: orders.filter((o) => o.status === "shipping").length,
        delivered: orders.filter((o) => o.status === "delivered").length,
        revenue: orders.reduce((sum, o) => sum + parseFloat(o.total), 0),
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via.white to-indigo-50 dark:from-gray-900 dark:via-gray-950 dark:to-violet-950" />

            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-violet-400/30 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />

            <div className="relative px-4 py-8 md:py-12">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/50 dark:to-indigo-900/50 border border-violet-200 dark:border-violet-800 mb-6">
                            <span className="animate-pulse w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                                Order Management
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            <span className="bg-gradient-to-r from-gray-900 via-violet-800 to-gray-900 dark:from-white dark:via-violet-300 dark:to-white bg-clip-text text-transparent">
                                Manage Orders
                            </span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            View and update customer order statuses
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                        {[
                            { label: "Total Orders", value: stats.total, color: "violet" },
                            { label: "Processing", value: stats.processing, color: "yellow" },
                            { label: "Shipping", value: stats.shipping, color: "blue" },
                            { label: "Delivered", value: stats.delivered, color: "green" },
                            { label: "Revenue", value: `$${stats.revenue.toFixed(2)}`, color: "indigo" },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-4"
                            >
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {stat.label}
                                </p>
                                <p className={`text-2xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400`}>
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {["all", "processing", "shipping", "delivered"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${filter === status
                                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg"
                                        : "bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                                    }`}
                            >
                                {status === "all" ? "All Orders" : formatStatus(status)}
                                {status !== "all" && (
                                    <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs bg-white/20">
                                        {orders.filter((o) => o.status === status).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="bg-white/80 dark:bg-gray-900/80 rounded-xl p-6 animate-pulse"
                                >
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4" />
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Error State */}
                    {error && !isLoading && (
                        <div className="text-center py-12">
                            <p className="text-red-500 mb-4">{error}</p>
                            <Button onClick={fetchOrders}>Retry</Button>
                        </div>
                    )}

                    {/* Orders Table */}
                    {!isLoading && !error && (
                        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
                            {filteredOrders.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No orders found
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50/80 dark:bg-gray-800/50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                    Order
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                    Customer
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                    Items
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                    Total
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200/50 dark:divide-gray-800/50">
                                            {filteredOrders.map((order) => (
                                                <tr
                                                    key={order.id}
                                                    className="hover:bg-violet-50/50 dark:hover:bg-violet-900/10 transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <p className="font-semibold text-gray-900 dark:text-white">
                                                            {order.order_number}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[150px]">
                                                            {order.user_email || "N/A"}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {order.items?.length || 0} item(s)
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="font-semibold text-violet-600 dark:text-violet-400">
                                                            ${parseFloat(order.total).toFixed(2)}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {formatDate(order.created_at)}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusStyles(
                                                                order.status
                                                            )}`}
                                                        >
                                                            {formatStatus(order.status)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) =>
                                                                handleStatusChange(order.id, e.target.value)
                                                            }
                                                            disabled={updatingOrderId === order.id}
                                                            className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:opacity-50 transition-all cursor-pointer"
                                                        >
                                                            <option value="processing">Processing</option>
                                                            <option value="shipping">Shipping</option>
                                                            <option value="delivered">Delivered</option>
                                                        </select>
                                                        {updatingOrderId === order.id && (
                                                            <span className="ml-2 text-xs text-violet-500">
                                                                Updating...
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Refresh Button */}
                    {!isLoading && (
                        <div className="text-center mt-8">
                            <Button
                                onClick={fetchOrders}
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
                                Refresh Orders
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
