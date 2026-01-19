import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutLoading() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />

            {/* Hero Section Skeleton */}
            <section className="pt-24 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-violet-600/5 to-transparent dark:from-violet-600/10" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto animate-pulse">
                        <div className="inline-block w-24 h-8 bg-violet-100 dark:bg-violet-900/30 rounded-full mb-6" />
                        <div className="h-14 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4 mx-auto mb-6" />
                        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2" />
                        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mx-auto" />
                    </div>
                </div>
            </section>

            {/* Stats Section Skeleton */}
            <section className="py-16 bg-white dark:bg-gray-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="text-center animate-pulse">
                                <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg w-20 mx-auto mb-2" />
                                <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-24 mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section Skeleton */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="animate-pulse space-y-4">
                            <div className="w-24 h-8 bg-violet-100 dark:bg-violet-900/30 rounded-full" />
                            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                            </div>
                        </div>
                        <div className="animate-pulse">
                            <div className="aspect-square rounded-3xl bg-gray-200 dark:bg-gray-800" />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
