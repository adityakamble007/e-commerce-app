import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactLoading() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />

            {/* Hero Section Skeleton */}
            <section className="pt-24 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-violet-600/5 to-transparent dark:from-violet-600/10" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto animate-pulse">
                        <div className="inline-block w-28 h-8 bg-violet-100 dark:bg-violet-900/30 rounded-full mb-6" />
                        <div className="h-14 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4 mx-auto mb-6" />
                        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2" />
                        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mx-auto" />
                    </div>
                </div>
            </section>

            {/* Contact Cards Skeleton */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700/50 animate-pulse">
                                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form Section Skeleton */}
            <section className="py-20 bg-white dark:bg-gray-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div className="animate-pulse space-y-6">
                            <div className="w-32 h-8 bg-violet-100 dark:bg-violet-900/30 rounded-full" />
                            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                                <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                            </div>
                            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                            <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                            <div className="h-14 bg-gray-200 dark:bg-gray-800 rounded-xl w-40" />
                        </div>
                        <div className="animate-pulse space-y-8">
                            <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                            <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
