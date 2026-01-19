import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function OrdersLoading() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-950 relative overflow-hidden pt-16">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-950 dark:to-violet-950" />

                {/* Decorative Elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-violet-400/30 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />

                <div className="relative min-h-screen px-4 py-12">
                    <div className="max-w-4xl mx-auto">
                        {/* Header Skeleton */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/50 mb-6 animate-pulse">
                                <div className="w-4 h-4 bg-violet-300 dark:bg-violet-700 rounded" />
                                <div className="w-20 h-4 bg-violet-300 dark:bg-violet-700 rounded" />
                            </div>
                            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg w-64 mx-auto mb-4 animate-pulse" />
                            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-80 max-w-full mx-auto animate-pulse" />
                        </div>

                        {/* Orders Skeleton */}
                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-800/50 p-6 animate-pulse"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                        <div className="space-y-2">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-24" />
                                            <div className="text-right space-y-1">
                                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                                        </div>
                                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
