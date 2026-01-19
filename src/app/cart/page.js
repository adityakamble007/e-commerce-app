"use client";

import { memo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/useCart";

// Cart Item Component with animations
const CartItem = memo(function CartItem({
    item,
    onUpdateQuantity,
    onRemove,
    isUpdating,
    isRemoving,
    animationDelay = 0
}) {
    const price = parseFloat(item.price) || 0;
    const originalPrice = parseFloat(item.original_price) || price;
    const hasDiscount = originalPrice > price;
    const [quantityAnimating, setQuantityAnimating] = useState(false);
    const prevQuantityRef = useRef(item.quantity);

    // Animate quantity changes
    useEffect(() => {
        if (item.quantity !== prevQuantityRef.current) {
            const animTimer = setTimeout(() => {
                setQuantityAnimating(true);
            }, 0);
            const timer = setTimeout(() => setQuantityAnimating(false), 350);
            prevQuantityRef.current = item.quantity;
            return () => {
                clearTimeout(animTimer);
                clearTimeout(timer);
            };
        }
    }, [item.quantity]);

    return (
        <div
            className={`
                group relative bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 
                shadow-lg hover:shadow-xl transition-all duration-300 
                border border-gray-100 dark:border-gray-800
                ${isRemoving ? 'animate-item-remove' : 'animate-item-enter'}
            `}
            style={{ animationDelay: isRemoving ? '0ms' : `${animationDelay}ms` }}
        >
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* Product Image */}
                <div className="relative w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex-shrink-0">
                    {item.image_url ? (
                        <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 128px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                    {/* Discount Badge */}
                    {hasDiscount && (
                        <Badge className="absolute top-2 left-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs border-0">
                            -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
                        </Badge>
                    )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                {item.title}
                            </h3>
                            {item.description && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                                    {item.description}
                                </p>
                            )}
                            <p className="text-sm text-emerald-500 flex items-center gap-1 mt-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                In Stock
                            </p>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                            <div className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                                ${(price * item.quantity).toFixed(2)}
                            </div>
                            {hasDiscount && (
                                <div className="text-sm text-gray-400 line-through">
                                    ${(originalPrice * item.quantity).toFixed(2)}
                                </div>
                            )}
                            {item.quantity > 1 && (
                                <div className="text-xs text-gray-500 mt-1">
                                    ${price.toFixed(2)} each
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Qty:</span>
                            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                    className="p-2 hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors disabled:opacity-50 active:scale-95"
                                    disabled={item.quantity <= 1 || isUpdating}
                                >
                                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                </button>
                                <span className={`
                                    px-4 py-2 text-sm font-medium text-gray-900 dark:text-white min-w-[40px] text-center
                                    transition-all duration-300 rounded-lg
                                    ${quantityAnimating ? 'animate-quantity-pulse' : ''}
                                `}>
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                    className="p-2 hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors disabled:opacity-50 active:scale-95"
                                    disabled={isUpdating}
                                >
                                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Remove Button */}
                        <button
                            onClick={() => onRemove(item.id)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all duration-200 disabled:opacity-50 active:scale-95"
                            disabled={isUpdating || isRemoving}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

// Order Summary Component
const OrderSummary = memo(function OrderSummary({ cartItems, isLoading }) {
    const subtotal = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        return sum + price * item.quantity;
    }, 0);
    const originalTotal = cartItems.reduce((sum, item) => {
        const original = parseFloat(item.original_price) || parseFloat(item.price) || 0;
        return sum + original * item.quantity;
    }, 0);
    const discount = originalTotal - subtotal;
    const shipping = subtotal > 100 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
            </h2>

            <div className="space-y-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                    <div className="flex justify-between text-emerald-500">
                        <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            Discount
                        </span>
                        <span>-${discount.toFixed(2)}</span>
                    </div>
                )}

                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-2">
                        Shipping
                        {shipping === 0 && (
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs">
                                FREE
                            </Badge>
                        )}
                    </span>
                    <span>{shipping === 0 ? "$0.00" : `$${shipping.toFixed(2)}`}</span>
                </div>

                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Estimated Tax</span>
                    <span>${tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                            ${total.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Free Shipping Progress */}
            {shipping > 0 && subtotal > 0 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-xl">
                    <div className="flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 mb-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Add ${(100 - subtotal).toFixed(2)} more for FREE shipping!
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (subtotal / 100) * 100)}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Checkout Button */}
            <Link href="/checkout" className="w-full">
                <Button
                    className="w-full mt-6 h-14 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-lg font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 rounded-xl disabled:opacity-50"
                    disabled={isLoading || cartItems.length === 0}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Proceed to Checkout
                </Button>
            </Link>

            {/* Security Badge */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure checkout with SSL encryption</span>
            </div>

            {/* Promo Code */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Have a promo code?
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter code"
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                    <Button variant="outline" className="px-4 rounded-xl border-violet-300 text-violet-600 hover:bg-violet-50 dark:border-violet-700 dark:text-violet-400 dark:hover:bg-violet-900/20">
                        Apply
                    </Button>
                </div>
            </div>
        </div>
    );
});

// Empty Cart Component
const EmptyCart = memo(function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-32 h-32 mb-8 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Your cart is empty
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-8">
                Looks like you haven&apos;t added anything to your cart yet. Start shopping and discover amazing products!
            </p>
            <Link href="/products">
                <Button className="h-12 px-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 rounded-xl font-medium">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Start Shopping
                </Button>
            </Link>
        </div>
    );
});

// Loading Skeleton
const CartSkeleton = memo(function CartSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 animate-pulse">
                    <div className="flex gap-6">
                        <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                        <div className="flex-1 space-y-3">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 mt-4" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
});

export default function CartPage() {
    const {
        items: cartItems,
        isLoading,
        updateQuantity,
        removeFromCart,
        clearCart
    } = useCart();

    const [removingItemId, setRemovingItemId] = useState(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    // Track if initial animation has played
    useEffect(() => {
        if (!isLoading && cartItems.length > 0 && !hasAnimated) {
            const timer = setTimeout(() => {
                setHasAnimated(true);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isLoading, cartItems.length, hasAnimated]);

    // Handle removal with animation delay
    const handleRemoveItem = async (itemId) => {
        setRemovingItemId(itemId);
        // Wait for animation to complete before actually removing
        setTimeout(async () => {
            await removeFromCart(itemId);
            setRemovingItemId(null);
        }, 400);
    };

    const handleClearCart = async () => {
        await clearCart();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
            <Navbar />

            <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                                Shopping Cart
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                {isLoading
                                    ? 'Loading your cart...'
                                    : cartItems.length > 0
                                        ? `${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart`
                                        : 'Your cart is empty'
                                }
                            </p>
                        </div>

                        {cartItems.length > 0 && !isLoading && (
                            <div className="flex items-center gap-4">
                                <Link href="/products" prefetch={true}>
                                    <Button variant="outline" className="rounded-xl border-violet-300 text-violet-600 hover:bg-violet-50 dark:border-violet-700 dark:text-violet-400 dark:hover:bg-violet-900/20 transition-all duration-200 active:scale-95">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Continue Shopping
                                    </Button>
                                </Link>
                                <button
                                    onClick={handleClearCart}
                                    className="text-sm text-rose-500 hover:text-rose-600 transition-colors active:scale-95"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <CartSkeleton />
                            </div>
                            <div className="lg:col-span-1">
                                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 animate-pulse">
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6" />
                                    <div className="space-y-4">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mt-6" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : cartItems.length === 0 ? (
                        <EmptyCart />
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {cartItems.map((item, index) => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                        onUpdateQuantity={updateQuantity}
                                        onRemove={handleRemoveItem}
                                        isUpdating={isLoading}
                                        isRemoving={removingItemId === item.id}
                                        animationDelay={hasAnimated ? 0 : index * 100}
                                    />
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <OrderSummary cartItems={cartItems} isLoading={isLoading} />
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
