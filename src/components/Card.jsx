"use client";

import { memo } from "react";
import {
    Card as ShadcnCard,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

// Memoized star component to prevent recreation
const Star = memo(function Star({ type }) {
    if (type === "full") {
        return (
            <svg
                className="w-4 h-4 text-amber-400 fill-current"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        );
    }
    if (type === "half") {
        return (
            <svg className="w-4 h-4 text-amber-400" viewBox="0 0 20 20">
                <defs>
                    <linearGradient id="half-fill">
                        <stop offset="50%" stopColor="currentColor" />
                        <stop offset="50%" stopColor="transparent" />
                    </linearGradient>
                </defs>
                <path
                    fill="url(#half-fill)"
                    stroke="currentColor"
                    strokeWidth="1"
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
            </svg>
        );
    }
    return (
        <svg
            className="w-4 h-4 text-gray-300 dark:text-gray-600"
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    );
});

// Memoized star rating component
const StarRating = memo(function StarRating({ rating }) {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    for (let i = 0; i < fullStars; i++) {
        stars.push(<Star key={`full-${i}`} type="full" />);
    }
    if (hasHalfStar) {
        stars.push(<Star key="half" type="half" />);
    }
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<Star key={`empty-${i}`} type="empty" />);
    }

    return <div className="flex items-center gap-0.5">{stars}</div>;
});

function Card({
    image,
    title,
    price,
    originalPrice,
    description,
    rating = 4.5,
    reviews = 120,
    badge,
    onAddToCart,
}) {
    return (
        <ShadcnCard className="group relative overflow-hidden border-0 bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-2xl">
            {/* Image Container */}
            <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                {image ? (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        quality={80}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg
                            className="w-16 h-16 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Badge */}
                {badge && (
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0 shadow-lg">
                        {badge}
                    </Badge>
                )}

                {/* Quick Actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                    <button className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-violet-100 dark:hover:bg-violet-900 transition-colors duration-200">
                        <svg
                            className="w-5 h-5 text-gray-700 dark:text-gray-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                    </button>
                    <button className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-violet-100 dark:hover:bg-violet-900 transition-colors duration-200">
                        <svg
                            className="w-5 h-5 text-gray-700 dark:text-gray-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <CardContent className="p-5">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={rating} />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({reviews})
                    </span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-200">
                    {title}
                </h3>

                {/* Description */}
                {description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                        {description}
                    </p>
                )}

                {/* Price */}
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                        ${price}
                    </span>
                    {originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                            ${originalPrice}
                        </span>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-5 pt-0">
                <Button
                    onClick={onAddToCart}
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all duration-300 rounded-xl h-12 font-medium"
                >
                    <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                    Add to Cart
                </Button>
            </CardFooter>
        </ShadcnCard>
    );
}

// Export memoized Card to prevent unnecessary re-renders
export default memo(function Card({
    image,
    title,
    price,
    originalPrice,
    description,
    rating = 4.5,
    reviews = 120,
    badge,
    onAddToCart,
    showAddToCart = true,
    footer,
    extraContent,
    isAdding = false
}) {
    return (
        <ShadcnCard className="group relative overflow-hidden border-0 bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-2xl">
            {/* Image Container */}
            <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                {image ? (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        quality={80}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg
                            className="w-16 h-16 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Badge */}
                {badge && (
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0 shadow-lg">
                        {badge}
                    </Badge>
                )}

                {/* Quick Actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                    <button className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-violet-100 dark:hover:bg-violet-900 transition-colors duration-200">
                        <svg
                            className="w-5 h-5 text-gray-700 dark:text-gray-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                    </button>
                    <button className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-violet-100 dark:hover:bg-violet-900 transition-colors duration-200">
                        <svg
                            className="w-5 h-5 text-gray-700 dark:text-gray-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <CardContent className="p-5">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={rating} />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({reviews})
                    </span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-200">
                    {title}
                </h3>

                {/* Description */}
                {description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                        {description}
                    </p>
                )}

                {/* Price */}
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                        ${price}
                    </span>
                    {originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                            ${originalPrice}
                        </span>
                    )}
                </div>

                {/* Extra Content (e.g., date added) */}
                {extraContent && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        {extraContent}
                    </div>
                )}
            </CardContent>

            {/* Footer or Default Action */}
            {footer ? (
                <CardFooter className="p-5 pt-0">
                    {footer}
                </CardFooter>
            ) : showAddToCart ? (
                <CardFooter className="p-5 pt-0">
                    <Button
                        onClick={onAddToCart}
                        disabled={isAdding}
                        className={`
                            w-full bg-gradient-to-r from-violet-600 to-indigo-600 
                            hover:from-violet-700 hover:to-indigo-700 
                            text-white shadow-lg shadow-violet-500/20 
                            hover:shadow-violet-500/40 transition-all duration-300 
                            rounded-xl h-12 font-medium
                            disabled:opacity-70 disabled:cursor-not-allowed
                            ${isAdding ? 'animate-success-ripple' : ''}
                        `}
                    >
                        {isAdding ? (
                            <>
                                <svg
                                    className="w-5 h-5 mr-2 animate-spin"
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
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Adding...
                            </>
                        ) : (
                            <>
                                <svg
                                    className="w-5 h-5 mr-2 transition-transform group-hover:scale-110"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                Add to Cart
                            </>
                        )}
                    </Button>
                </CardFooter>
            ) : null}
        </ShadcnCard>
    );
});

