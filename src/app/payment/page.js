"use client";

import { memo, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/useCart";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Order Summary for Payment
const PaymentOrderSummary = memo(function PaymentOrderSummary({ cartItems }) {
    const subtotal = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        return sum + price * item.quantity;
    }, 0);
    const shipping = subtotal > 100 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Order Summary
            </h2>

            {/* Items Preview */}
            <div className="space-y-3 mb-6">
                {cartItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                            {item.image_url ? (
                                <Image
                                    src={item.image_url}
                                    alt={item.title}
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.title}</h4>
                            <p className="text-xs text-gray-500">x{item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </p>
                    </div>
                ))}
                {cartItems.length > 3 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        +{cartItems.length - 3} more items
                    </p>
                )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                            ${total.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
});

// Success Modal with animation
const SuccessModal = memo(function SuccessModal({ isOpen, orderNumber }) {
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                router.push("/");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, router]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
                {/* Success Icon with animation */}
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-in zoom-in duration-500">
                    <svg className="w-12 h-12 text-white animate-in fade-in duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
                    Payment Successful! 🎉
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                    Thank you for your purchase! Your order has been confirmed.
                </p>

                <div className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Order Number</span>
                        <span className="font-mono font-semibold text-violet-600 dark:text-violet-400">#{orderNumber}</span>
                    </div>
                </div>

                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Redirecting to home...
                    </div>
                </div>
            </div>
        </div>
    );
});

// Failure Modal with animation
const FailureModal = memo(function FailureModal({ isOpen, errorMessage, onRetry }) {
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                router.push("/");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, router]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
                {/* Failure Icon with animation */}
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30 animate-in zoom-in duration-500">
                    <svg className="w-12 h-12 text-white animate-in fade-in duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
                    Payment Failed
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
                    {errorMessage || "Something went wrong with your payment."}
                </p>

                <div className="bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20 rounded-xl p-4 mb-6">
                    <p className="text-sm text-rose-700 dark:text-rose-300 text-center">
                        Please try again or use a different payment method.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        onClick={onRetry}
                        className="w-full h-12 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-violet-500/30 rounded-xl"
                    >
                        Try Again
                    </Button>
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center justify-center gap-2">
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Redirecting to home in 5 seconds...
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

// Stripe Card Element styling
const cardElementOptions = {
    style: {
        base: {
            fontSize: "16px",
            color: "#1f2937",
            fontFamily: "system-ui, -apple-system, sans-serif",
            "::placeholder": {
                color: "#9ca3af",
            },
        },
        invalid: {
            color: "#ef4444",
            iconColor: "#ef4444",
        },
    },
};

// Payment Form Component (uses Stripe hooks)
function PaymentForm({ cartItems, total, onSuccess, onFailure }) {
    const stripe = useStripe();
    const elements = useElements();
    const { clearCart } = useCart();

    const [isProcessing, setIsProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState(null);
    const [cardError, setCardError] = useState(null);

    // Create payment intent on mount
    useEffect(() => {
        if (total > 0) {
            fetch("/api/payment/create-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: total }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        setClientSecret(data.clientSecret);
                    } else {
                        setCardError(data.error);
                    }
                })
                .catch((err) => {
                    setCardError("Failed to initialize payment. Please try again.");
                });
        }
    }, [total]);

    const handleSubmit = useCallback(async () => {
        if (!stripe || !elements || !clientSecret) {
            return;
        }

        setIsProcessing(true);
        setCardError(null);

        const cardElement = elements.getElement(CardElement);

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            },
        });

        if (error) {
            setCardError(error.message);
            setIsProcessing(false);
            onFailure(error.message);
        } else if (paymentIntent.status === "succeeded") {
            try {
                // Calculate order totals
                const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity, 0);
                const shipping = subtotal > 100 ? 0 : 9.99;
                const tax = subtotal * 0.08;

                // Create order in database
                const orderResponse = await fetch("/api/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        items: cartItems,
                        subtotal,
                        shipping,
                        tax,
                        total,
                        paymentIntentId: paymentIntent.id,
                    }),
                });

                const orderData = await orderResponse.json();

                if (orderData.success) {
                    // Clear cart after successful order creation
                    await clearCart();
                    onSuccess(orderData.orderNumber);
                } else {
                    // Payment succeeded but order creation failed
                    console.error("Order creation failed:", orderData.error);
                    await clearCart();
                    onSuccess(paymentIntent.id.slice(-8).toUpperCase());
                }
            } catch (orderError) {
                console.error("Error creating order:", orderError);
                // Payment still succeeded, clear cart
                await clearCart();
                onSuccess(paymentIntent.id.slice(-8).toUpperCase());
            }
        }
    }, [stripe, elements, clientSecret, cartItems, total, clearCart, onSuccess, onFailure]);

    const handleCardChange = (event) => {
        if (event.error) {
            setCardError(event.error.message);
        } else {
            setCardError(null);
        }
    };

    return (
        <>
            {/* Card Details with Stripe Element */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Card Details
                </h2>

                <div className="space-y-4">
                    {/* Stripe Card Element */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Card Information <span className="text-rose-500">*</span>
                        </label>
                        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                            <CardElement options={cardElementOptions} onChange={handleCardChange} />
                        </div>
                    </div>

                    {/* Card Error */}
                    {cardError && (
                        <div className="flex items-center gap-2 text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 p-3 rounded-lg">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {cardError}
                        </div>
                    )}
                </div>

                {/* Card Icons */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-xs text-gray-500">We accept:</span>
                    <div className="flex gap-2">
                        <Badge variant="secondary" className="text-xs">Visa</Badge>
                        <Badge variant="secondary" className="text-xs">Mastercard</Badge>
                        <Badge variant="secondary" className="text-xs">Amex</Badge>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/checkout" className="flex-1 sm:flex-none">
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto h-12 px-8 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700 transition-all"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Checkout
                    </Button>
                </Link>
                <Button
                    onClick={handleSubmit}
                    disabled={isProcessing || !stripe || !clientSecret}
                    className="flex-1 h-12 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-lg font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 rounded-xl disabled:opacity-70"
                >
                    {isProcessing ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Processing...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Pay ${total.toFixed(2)}
                        </>
                    )}
                </Button>
            </div>
        </>
    );
}

// Main Payment Page Component
function PaymentPageContent() {
    const { items: cartItems, isLoading } = useCart();

    const [showSuccess, setShowSuccess] = useState(false);
    const [showFailure, setShowFailure] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [orderNumber, setOrderNumber] = useState("");

    const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity, 0);
    const total = subtotal + (subtotal > 100 ? 0 : 9.99) + (subtotal * 0.08);

    const handleSuccess = useCallback((orderId) => {
        setOrderNumber(orderId);
        setShowSuccess(true);
    }, []);

    const handleFailure = useCallback((error) => {
        setErrorMessage(error);
        setShowFailure(true);
    }, []);

    const handleRetry = useCallback(() => {
        setShowFailure(false);
        setErrorMessage("");
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
                <Navbar />
                <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="animate-pulse space-y-8">
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                                </div>
                                <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (cartItems.length === 0 && !showSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
                <Navbar />
                <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-20">
                        <div className="w-24 h-24 mb-6 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No items to pay for</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-center mb-6">Add some items to your cart first.</p>
                        <Link href="/products">
                            <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/30">
                                Browse Products
                            </Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
            <Navbar />

            <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Link href="/checkout" className="text-gray-500 hover:text-violet-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                                Payment
                            </h1>
                        </div>

                        {/* Progress Steps */}
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Cart</span>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="font-medium text-violet-600 dark:text-violet-400">Payment</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Payment Form */}
                        <div className="lg:col-span-2 space-y-6">
                            <PaymentForm
                                cartItems={cartItems}
                                total={total}
                                onSuccess={handleSuccess}
                                onFailure={handleFailure}
                            />
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-4">
                                <PaymentOrderSummary cartItems={cartItems} />

                                {/* Security Info */}
                                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-emerald-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">Powered by Stripe</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Your payment is secure and encrypted</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-violet-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">Money-back Guarantee</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">30-day return policy</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Success Modal */}
            <SuccessModal isOpen={showSuccess} orderNumber={orderNumber} />

            {/* Failure Modal */}
            <FailureModal isOpen={showFailure} errorMessage={errorMessage} onRetry={handleRetry} />
        </div>
    );
}

// Wrap with Stripe Elements provider
export default function PaymentPage() {
    return (
        <Elements stripe={stripePromise}>
            <PaymentPageContent />
        </Elements>
    );
}
