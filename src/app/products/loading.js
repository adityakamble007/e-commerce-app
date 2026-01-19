import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";

export default function ProductsLoading() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />
            <section className="pt-24 pb-20 relative overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-950 dark:to-violet-950" />

                {/* Decorative Elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-violet-400/30 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Skeleton */}
                    <div className="text-center mb-12">
                        <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg w-64 mx-auto mb-4 animate-pulse" />
                        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-lg w-96 max-w-full mx-auto animate-pulse" />
                    </div>

                    {/* Products Grid Skeleton */}
                    <ProductGridSkeleton count={8} />
                </div>
            </section>
            <Footer />
        </main>
    );
}
