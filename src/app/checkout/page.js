"use client";

import { memo, useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/useCart";

// Country codes data with flags
const countryCodes = [
    { code: "+1", country: "US", flag: "🇺🇸", name: "United States" },
    { code: "+1", country: "CA", flag: "🇨🇦", name: "Canada" },
    { code: "+44", country: "GB", flag: "🇬🇧", name: "United Kingdom" },
    { code: "+91", country: "IN", flag: "🇮🇳", name: "India" },
    { code: "+61", country: "AU", flag: "🇦🇺", name: "Australia" },
    { code: "+49", country: "DE", flag: "🇩🇪", name: "Germany" },
    { code: "+33", country: "FR", flag: "🇫🇷", name: "France" },
    { code: "+81", country: "JP", flag: "🇯🇵", name: "Japan" },
    { code: "+86", country: "CN", flag: "🇨🇳", name: "China" },
    { code: "+55", country: "BR", flag: "🇧🇷", name: "Brazil" },
    { code: "+52", country: "MX", flag: "🇲🇽", name: "Mexico" },
    { code: "+39", country: "IT", flag: "🇮🇹", name: "Italy" },
    { code: "+34", country: "ES", flag: "🇪🇸", name: "Spain" },
    { code: "+82", country: "KR", flag: "🇰🇷", name: "South Korea" },
    { code: "+31", country: "NL", flag: "🇳🇱", name: "Netherlands" },
    { code: "+46", country: "SE", flag: "🇸🇪", name: "Sweden" },
    { code: "+41", country: "CH", flag: "🇨🇭", name: "Switzerland" },
    { code: "+65", country: "SG", flag: "🇸🇬", name: "Singapore" },
    { code: "+971", country: "AE", flag: "🇦🇪", name: "United Arab Emirates" },
    { code: "+966", country: "SA", flag: "🇸🇦", name: "Saudi Arabia" },
];

// Countries list for address dropdown
const countries = [
    "United States", "Canada", "United Kingdom", "India", "Australia",
    "Germany", "France", "Japan", "China", "Brazil", "Mexico", "Italy",
    "Spain", "South Korea", "Netherlands", "Sweden", "Switzerland",
    "Singapore", "United Arab Emirates", "Saudi Arabia"
];

// Input Field Component
const InputField = memo(function InputField({
    label,
    id,
    type = "text",
    placeholder,
    value,
    onChange,
    required = false,
    className = ""
}) {
    return (
        <div className={className}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label} {required && <span className="text-rose-500">*</span>}
            </label>
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
            />
        </div>
    );
});

// Phone Input Component with Country Code
const PhoneInput = memo(function PhoneInput({
    selectedCode,
    onCodeChange,
    phoneNumber,
    onPhoneChange,
    isDropdownOpen,
    onToggleDropdown
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-2">
                {/* Country Code Selector */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={onToggleDropdown}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 min-w-[120px]"
                    >
                        <span className="text-xl">{selectedCode.flag}</span>
                        <span>{selectedCode.code}</span>
                        <svg className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown */}
                    {isDropdownOpen && (
                        <div className="absolute z-50 mt-2 w-64 max-h-60 overflow-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl">
                            {countryCodes.map((country, index) => (
                                <button
                                    key={`${country.country}-${index}`}
                                    type="button"
                                    onClick={() => onCodeChange(country)}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors text-left"
                                >
                                    <span className="text-xl">{country.flag}</span>
                                    <span className="text-sm text-gray-900 dark:text-white">{country.name}</span>
                                    <span className="text-sm text-gray-500 ml-auto">{country.code}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Phone Number Input */}
                <input
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={phoneNumber}
                    onChange={onPhoneChange}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                />
            </div>
        </div>
    );
});

// Order Summary Component for Checkout
const CheckoutOrderSummary = memo(function CheckoutOrderSummary({ cartItems }) {
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

            {/* Cart Items Preview */}
            <div className="space-y-4 mb-6 max-h-64 overflow-auto">
                {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                            {item.image_url ? (
                                <Image
                                    src={item.image_url}
                                    alt={item.title}
                                    fill
                                    sizes="64px"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.title}</h4>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            <p className="text-sm font-semibold text-violet-600 dark:text-violet-400">
                                ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
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
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Estimated Tax</span>
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

export default function CheckoutPage() {
    const router = useRouter();
    const { items: cartItems, isLoading } = useCart();
    const { isSignedIn, isLoaded } = useAuth();

    // Form state
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "United States"
    });

    const [phoneNumber, setPhoneNumber] = useState("");
    const [selectedCode, setSelectedCode] = useState(countryCodes[0]);
    const [isCodeDropdownOpen, setIsCodeDropdownOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [addressLoaded, setAddressLoaded] = useState(false);

    // Load saved address for logged-in users
    useEffect(() => {
        if (!isLoaded || !isSignedIn || addressLoaded) return;

        const loadSavedAddress = async () => {
            try {
                const response = await fetch("/api/checkout/address");
                const data = await response.json();

                if (data.success && data.address) {
                    const addr = data.address;
                    setFormData({
                        fullName: addr.full_name || "",
                        email: addr.email || "",
                        addressLine1: addr.address_line1 || "",
                        addressLine2: addr.address_line2 || "",
                        city: addr.city || "",
                        state: addr.state || "",
                        postalCode: addr.postal_code || "",
                        country: addr.country || "United States"
                    });
                    setPhoneNumber(addr.phone_number || "");

                    // Find matching country code
                    if (addr.phone_country_code) {
                        const matchedCode = countryCodes.find(c => c.code === addr.phone_country_code);
                        if (matchedCode) {
                            setSelectedCode(matchedCode);
                        }
                    }
                }
                setAddressLoaded(true);
            } catch (error) {
                console.error("Failed to load saved address:", error);
                setAddressLoaded(true);
            }
        };

        loadSavedAddress();
    }, [isLoaded, isSignedIn, addressLoaded]);

    // Handlers
    const handleInputChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleCodeChange = (country) => {
        setSelectedCode(country);
        setIsCodeDropdownOpen(false);
    };

    const handleProceedToPayment = useCallback(async () => {
        // Check if user is logged in
        if (!isSignedIn) {
            // Redirect to login with return URL
            router.push("/sign-in?redirect_url=/checkout");
            return;
        }

        setIsSaving(true);

        try {
            // Save address to database
            const response = await fetch("/api/checkout/address", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    phoneCountryCode: selectedCode.code,
                    phoneNumber: phoneNumber,
                    addressLine1: formData.addressLine1,
                    addressLine2: formData.addressLine2,
                    city: formData.city,
                    state: formData.state,
                    postalCode: formData.postalCode,
                    country: formData.country,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || "Failed to save address");
            }

            // Proceed to payment
            router.push("/payment");
        } catch (error) {
            console.error("Failed to save address:", error);
            // Still proceed to payment even if save fails
            router.push("/payment");
        } finally {
            setIsSaving(false);
        }
    }, [isSignedIn, router, formData, selectedCode, phoneNumber]);

    // Check if form is valid (basic validation)
    const isFormValid = useMemo(() => {
        return (
            formData.fullName.trim() !== "" &&
            formData.email.trim() !== "" &&
            formData.addressLine1.trim() !== "" &&
            formData.city.trim() !== "" &&
            formData.state.trim() !== "" &&
            formData.postalCode.trim() !== "" &&
            phoneNumber.trim() !== ""
        );
    }, [formData, phoneNumber]);

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
                                    <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
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

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
                <Navbar />
                <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-20">
                        <div className="w-24 h-24 mb-6 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Your cart is empty</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-center mb-6">Add some items to your cart before checkout.</p>
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
                            <Link href="/cart" className="text-gray-500 hover:text-violet-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                                Checkout
                            </h1>
                        </div>

                        {/* Progress Steps */}
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Cart</span>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="font-medium text-violet-600 dark:text-violet-400">Shipping</span>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-gray-500 dark:text-gray-400">Payment</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Shipping Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Contact Information */}
                            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Contact Information
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InputField
                                        label="Full Name"
                                        id="fullName"
                                        placeholder="John Doe"
                                        value={formData.fullName}
                                        onChange={handleInputChange("fullName")}
                                        required
                                    />
                                    <InputField
                                        label="Email Address"
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleInputChange("email")}
                                        required
                                    />
                                </div>

                                <div className="mt-4">
                                    <PhoneInput
                                        selectedCode={selectedCode}
                                        onCodeChange={handleCodeChange}
                                        phoneNumber={phoneNumber}
                                        onPhoneChange={(e) => setPhoneNumber(e.target.value)}
                                        isDropdownOpen={isCodeDropdownOpen}
                                        onToggleDropdown={() => setIsCodeDropdownOpen(!isCodeDropdownOpen)}
                                    />
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Shipping Address
                                </h2>

                                <div className="space-y-4">
                                    <InputField
                                        label="Address Line 1"
                                        id="addressLine1"
                                        placeholder="123 Main Street"
                                        value={formData.addressLine1}
                                        onChange={handleInputChange("addressLine1")}
                                        required
                                    />
                                    <InputField
                                        label="Address Line 2"
                                        id="addressLine2"
                                        placeholder="Apartment, suite, unit, etc. (optional)"
                                        value={formData.addressLine2}
                                        onChange={handleInputChange("addressLine2")}
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InputField
                                            label="City"
                                            id="city"
                                            placeholder="New York"
                                            value={formData.city}
                                            onChange={handleInputChange("city")}
                                            required
                                        />
                                        <InputField
                                            label="State / Province"
                                            id="state"
                                            placeholder="NY"
                                            value={formData.state}
                                            onChange={handleInputChange("state")}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InputField
                                            label="Postal / ZIP Code"
                                            id="postalCode"
                                            placeholder="10001"
                                            value={formData.postalCode}
                                            onChange={handleInputChange("postalCode")}
                                            required
                                        />
                                        <div>
                                            <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Country <span className="text-rose-500">*</span>
                                            </label>
                                            <select
                                                id="country"
                                                value={formData.country}
                                                onChange={handleInputChange("country")}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                                            >
                                                {countries.map((country) => (
                                                    <option key={country} value={country}>{country}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/cart" className="flex-1 sm:flex-none">
                                    <Button
                                        variant="outline"
                                        className="w-full sm:w-auto h-12 px-8 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700 transition-all"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Back to Cart
                                    </Button>
                                </Link>
                                <Button
                                    onClick={handleProceedToPayment}
                                    disabled={!isFormValid || isSaving}
                                    className="flex-1 h-12 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-lg font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? (
                                        <>
                                            <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            Proceed to Payment
                                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24">
                                <CheckoutOrderSummary cartItems={cartItems} />

                                {/* Security Badge */}
                                <div className="mt-4 p-4 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm">
                                            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">Secure Checkout</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Your information is protected</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
