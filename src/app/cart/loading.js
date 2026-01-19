import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CartLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
            <Navbar />
            <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header Skeleton */}
                    <div className="mb-8">
                        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg w-48 mb-2 animate-pulse" />
                        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-32 animate-pulse" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items Skeleton */}
                        <div className="lg:col-span-2 space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 animate-pulse"
                                >
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

                        {/* Order Summary Skeleton */}
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
                </div>
            </main>
            <Footer />
        </div>
    );
}
