"use client";

import { memo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/useCart";

// Payment method options
const paymentMethods = [
    { id: "card", name: "Credit / Debit Card", icon: "💳", description: "Visa, Mastercard, Amex" },
    { id: "paypal", name: "PayPal", icon: "🅿️", description: "Pay with PayPal account" },
    { id: "applepay", name: "Apple Pay", icon: "🍎", description: "Quick checkout with Apple" },
    { id: "googlepay", name: "Google Pay", icon: "🔵", description: "Pay with Google" },
];

// Card Input Component
const CardInput = memo(function CardInput({ label, id, placeholder, value, onChange, maxLength }) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label} <span className="text-rose-500">*</span>
            </label>
            <input
                type="text"
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                maxLength={maxLength}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 font-mono"
            />
        </div>
    );
});

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

// Success Modal
const SuccessModal = memo(function SuccessModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full shadow-2xl transform animate-bounce-in">
                {/* Success Icon */}
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <svg className="w-10 h-10 text-white animate-check-mark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
                    Order Placed Successfully!
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                    Thank you for your purchase. Your order has been confirmed and will be delivered soon.
                </p>

                <div className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Order Number</span>
                        <span className="font-mono font-semibold text-violet-600 dark:text-violet-400">#SV{Date.now().toString().slice(-8)}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Link href="/products" className="w-full">
                        <Button className="w-full h-12 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-violet-500/30 rounded-xl">
                            Continue Shopping
                        </Button>
                    </Link>
                    <Link href="/" className="w-full">
                        <Button variant="outline" className="w-full h-12 rounded-xl border-2">
                            Go to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
});

export default function PaymentPage() {
    const { items: cartItems, isLoading, clearCart } = useCart();

    const [selectedMethod, setSelectedMethod] = useState("card");
    const [cardDetails, setCardDetails] = useState({
        number: "",
        expiry: "",
        cvv: "",
        name: ""
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Format card number with spaces
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || "";
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        return parts.length ? parts.join(" ") : value;
    };

    // Format expiry date
    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        if (v.length >= 2) {
            return v.substring(0, 2) + "/" + v.substring(2, 4);
        }
        return v;
    };

    const handleCardNumberChange = (e) => {
        const formatted = formatCardNumber(e.target.value);
        setCardDetails(prev => ({ ...prev, number: formatted }));
    };

    const handleExpiryChange = (e) => {
        const formatted = formatExpiry(e.target.value.replace("/", ""));
        setCardDetails(prev => ({ ...prev, expiry: formatted }));
    };

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsProcessing(false);
        setShowSuccess(true);
        // Clear cart after successful order
        await clearCart();
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity, 0);
    const total = subtotal + (subtotal > 100 ? 0 : 9.99) + (subtotal * 0.08);

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
                            {/* Payment Method Selection */}
                            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    Payment Method
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {paymentMethods.map((method) => (
                                        <button
                                            key={method.id}
                                            onClick={() => setSelectedMethod(method.id)}
                                            className={`
                        relative p-4 rounded-xl border-2 text-left transition-all duration-200
                        ${selectedMethod === method.id
                                                    ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                                                    : "border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700"
                                                }
                      `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{method.icon}</span>
                                                <div>
                                                    <h3 className="font-medium text-gray-900 dark:text-white">{method.name}</h3>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{method.description}</p>
                                                </div>
                                            </div>
                                            {selectedMethod === method.id && (
                                                <div className="absolute top-3 right-3 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Card Details */}
                            {selectedMethod === "card" && (
                                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                                        </svg>
                                        Card Details
                                    </h2>

                                    <div className="space-y-4">
                                        <CardInput
                                            label="Card Number"
                                            id="cardNumber"
                                            placeholder="1234 5678 9012 3456"
                                            value={cardDetails.number}
                                            onChange={handleCardNumberChange}
                                            maxLength={19}
                                        />

                                        <div className="grid grid-cols-2 gap-4">
                                            <CardInput
                                                label="Expiry Date"
                                                id="expiry"
                                                placeholder="MM/YY"
                                                value={cardDetails.expiry}
                                                onChange={handleExpiryChange}
                                                maxLength={5}
                                            />
                                            <CardInput
                                                label="CVV"
                                                id="cvv"
                                                placeholder="123"
                                                value={cardDetails.cvv}
                                                onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, "") }))}
                                                maxLength={4}
                                            />
                                        </div>

                                        <CardInput
                                            label="Cardholder Name"
                                            id="cardName"
                                            placeholder="John Doe"
                                            value={cardDetails.name}
                                            onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                                        />
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
                            )}

                            {/* PayPal / Other methods placeholder */}
                            {selectedMethod !== "card" && (
                                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-800 text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center">
                                        <span className="text-3xl">{paymentMethods.find(m => m.id === selectedMethod)?.icon}</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        {paymentMethods.find(m => m.id === selectedMethod)?.name}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        You will be redirected to complete your payment securely.
                                    </p>
                                </div>
                            )}

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
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing}
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
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">SSL Encrypted</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Your payment information is secure</p>
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
            <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
        </div>
    );
}
