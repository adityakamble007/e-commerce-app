"use client";

import { memo } from "react";

/**
 * Skeleton component for a single card
 */
const ProductCardSkeleton = memo(function ProductCardSkeleton() {
    return (
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200 dark:bg-gray-700" />
            <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            </div>
        </div>
    );
});

/**
 * Grid of skeletons
 * @param {Object} props
 * @param {number} props.count Number of skeletons to show
 */
export default function ProductGridSkeleton({ count = 8 }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(count)].map((_, index) => (
                <ProductCardSkeleton key={index} />
            ))}
        </div>
    );
}
