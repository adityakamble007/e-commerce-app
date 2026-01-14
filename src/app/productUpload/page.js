"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useUploadThing } from "@/lib/uploadthing";
import AdminNavbar from "@/components/AdminNavbar";

export default function ProductUpload() {
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        originalPrice: "",
        description: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const fileInputRef = useRef(null);

    // Initialize UploadThing hook
    const { startUpload } = useUploadThing("productImage", {
        onUploadProgress: (progress) => {
            setUploadProgress(progress);
        },
        onUploadError: (error) => {
            console.error("Upload error:", error);
            setError(error.message || "Failed to upload image");
            setIsUploading(false);
        },
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (error) setError(null);
    };

    const handleImageChange = (file) => {
        if (file && file.type.startsWith("image/")) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            // Clear error when image is selected
            if (error) setError(null);
        }
    };

    const handleFileInput = (e) => {
        const file = e.target.files?.[0];
        handleImageChange(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        handleImageChange(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validate form
        if (!formData.title || !formData.price || !formData.description) {
            setError("Please fill in all required fields");
            return;
        }

        if (!imageFile) {
            setError("Please select an image to upload");
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Step 1: Upload image to UploadThing
            console.log("📤 Uploading image to UploadThing...");
            const uploadResult = await startUpload([imageFile]);

            if (!uploadResult || uploadResult.length === 0) {
                throw new Error("Image upload failed - no result returned");
            }

            const imageUrl = uploadResult[0].ufsUrl || uploadResult[0].url;
            console.log("✅ Image uploaded:", imageUrl);

            // Step 2: Save product to database
            console.log("💾 Saving product to database...");
            const response = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: formData.title,
                    price: formData.price,
                    originalPrice: formData.originalPrice || null,
                    description: formData.description,
                    imageUrl: imageUrl,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.error || "Failed to save product to database"
                );
            }

            console.log("✅ Product saved:", result.product);

            // Show success animation
            setShowSuccess(true);
            setIsUploading(false);

            // Reset form after delay
            setTimeout(() => {
                setFormData({
                    title: "",
                    price: "",
                    originalPrice: "",
                    description: "",
                });
                setImageFile(null);
                setImagePreview(null);
                setShowSuccess(false);
                setUploadProgress(0);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }, 3000);
        } catch (err) {
            console.error("❌ Upload failed:", err);
            setError(err.message || "Something went wrong. Please try again.");
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <>
            <AdminNavbar />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-950 relative overflow-hidden pt-16">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-950 dark:to-violet-950" />

                {/* Decorative Elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-violet-400/30 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
                <div className="absolute top-40 right-20 w-48 h-48 bg-pink-300/20 rounded-full blur-2xl" />

                {/* Success Animation Overlay */}
                {showSuccess && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 shadow-2xl animate-bounce-in">
                            {/* Animated Checkmark */}
                            <div className="relative w-32 h-32 mx-auto mb-6">
                                {/* Confetti particles */}
                                <div className="absolute inset-0">
                                    {[...Array(12)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute w-3 h-3 rounded-full animate-confetti"
                                            style={{
                                                backgroundColor: [
                                                    "#8B5CF6",
                                                    "#EC4899",
                                                    "#10B981",
                                                    "#F59E0B",
                                                    "#3B82F6",
                                                ][i % 5],
                                                left: "50%",
                                                top: "50%",
                                                animationDelay: `${i * 0.05}s`,
                                                transform: `rotate(${i * 30
                                                    }deg) translateY(-50px)`,
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Circle background */}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-scale-in" />

                                {/* Checkmark */}
                                <svg
                                    className="absolute inset-0 w-32 h-32 text-white p-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className="animate-draw-check"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        strokeDasharray="30"
                                        strokeDashoffset="30"
                                        d="M5 13l4 4L19 7"
                                        style={{
                                            animation:
                                                "draw-check 0.5s ease-out 0.3s forwards",
                                        }}
                                    />
                                </svg>
                            </div>

                            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
                                Product Uploaded!
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-center">
                                Your product has been successfully added to the
                                store.
                            </p>
                        </div>
                    </div>
                )}

                <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
                    <div className="w-full max-w-2xl">
                        {/* Header */}
                        <div className="text-center mb-10">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/50 dark:to-indigo-900/50 border border-violet-200 dark:border-violet-800 mb-6">
                                <span className="animate-pulse w-2 h-2 rounded-full bg-green-500" />
                                <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                                    Admin Panel
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                <span className="bg-gradient-to-r from-gray-900 via-violet-800 to-gray-900 dark:from-white dark:via-violet-300 dark:to-white bg-clip-text text-transparent">
                                    Upload Product
                                </span>
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                Add a new product to your store catalog
                            </p>
                        </div>

                        {/* Form Card */}
                        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-violet-500/10 border border-gray-200 dark:border-gray-800 p-8 md:p-10">
                            {/* Error Alert */}
                            {error && (
                                <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
                                    <svg
                                        className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                            Upload Failed
                                        </p>
                                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                            {error}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label
                                        htmlFor="title"
                                        className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                                    >
                                        Product Title
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Enter product title"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300"
                                        required
                                        disabled={isUploading}
                                    />
                                </div>

                                {/* Price Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Price */}
                                    <div>
                                        <label
                                            htmlFor="price"
                                            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                                        >
                                            Price ($)
                                        </label>
                                        <input
                                            type="number"
                                            id="price"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0"
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300"
                                            required
                                            disabled={isUploading}
                                        />
                                    </div>

                                    {/* Original Price */}
                                    <div>
                                        <label
                                            htmlFor="originalPrice"
                                            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                                        >
                                            Original Price ($)
                                            <span className="text-gray-400 font-normal ml-1">
                                                - Optional
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            id="originalPrice"
                                            name="originalPrice"
                                            value={formData.originalPrice}
                                            onChange={handleInputChange}
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0"
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300"
                                            disabled={isUploading}
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label
                                        htmlFor="description"
                                        className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Enter product description"
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 resize-none"
                                        required
                                        disabled={isUploading}
                                    />
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Product Image
                                    </label>

                                    {!imagePreview ? (
                                        <div
                                            onClick={() =>
                                                !isUploading &&
                                                fileInputRef.current?.click()
                                            }
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${isDragging
                                                ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                                                : "border-gray-300 dark:border-gray-600 hover:border-violet-400 dark:hover:border-violet-500 bg-gray-50 dark:bg-gray-800/50"
                                                } ${isUploading
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                                }`}
                                        >
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileInput}
                                                className="hidden"
                                                disabled={isUploading}
                                            />
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/50 dark:to-indigo-900/50 flex items-center justify-center">
                                                    <svg
                                                        className="w-8 h-8 text-violet-600 dark:text-violet-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                                                        Drop your image here, or{" "}
                                                        <span className="text-violet-600 dark:text-violet-400">
                                                            browse
                                                        </span>
                                                    </p>
                                                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                                        PNG, JPG, GIF up to 4MB
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-64 object-cover"
                                            />
                                            {!isUploading && (
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                                                >
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </button>
                                            )}

                                            {/* Upload Progress Overlay */}
                                            {isUploading && (
                                                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                                                    <div className="w-16 h-16 mb-4">
                                                        <svg
                                                            className="animate-spin w-full h-full text-white"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <circle
                                                                className="opacity-25"
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                            />
                                                            <path
                                                                className="opacity-75"
                                                                fill="currentColor"
                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <p className="text-white font-medium mb-2">
                                                        Uploading...
                                                    </p>
                                                    <div className="w-48 h-2 bg-white/30 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-white rounded-full transition-all duration-300"
                                                            style={{
                                                                width: `${uploadProgress}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <p className="text-white/80 text-sm mt-2">
                                                        {uploadProgress}%
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={isUploading}
                                    className={`w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-8 py-6 text-lg rounded-xl shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 hover:-translate-y-1 mt-8 ${isUploading
                                        ? "opacity-70 cursor-not-allowed hover:translate-y-0"
                                        : ""
                                        }`}
                                >
                                    {isUploading ? (
                                        <>
                                            <svg
                                                className="animate-spin w-5 h-5 mr-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                                />
                                            </svg>
                                            Uploading Product...
                                        </>
                                    ) : (
                                        <>
                                            Upload Product
                                            <svg
                                                className="w-5 h-5 ml-2"
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
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>

                        {/* Back Link */}
                        <div className="text-center mt-8">
                            <a
                                href="/"
                                className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
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
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                                Back to Store
                            </a>
                        </div>
                    </div>
                </div>

                {/* Custom Animations CSS */}
                <style jsx>{`
                @keyframes bounce-in {
                    0% {
                        transform: scale(0.5);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1.05);
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                @keyframes scale-in {
                    0% {
                        transform: scale(0);
                    }
                    50% {
                        transform: scale(1.1);
                    }
                    100% {
                        transform: scale(1);
                    }
                }

                @keyframes draw-check {
                    to {
                        stroke-dashoffset: 0;
                    }
                }

                @keyframes confetti {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-100px) rotate(720deg);
                        opacity: 0;
                    }
                }

                .animate-bounce-in {
                    animation: bounce-in 0.5s ease-out forwards;
                }

                .animate-scale-in {
                    animation: scale-in 0.4s ease-out forwards;
                }

                .animate-confetti {
                    animation: confetti 1s ease-out forwards;
                }
            `}</style>
            </main>
        </>
    );
}
