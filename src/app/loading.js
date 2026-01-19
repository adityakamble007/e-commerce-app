import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Loading() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-violet-200 dark:border-violet-900 rounded-full" />
                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-violet-600 rounded-full animate-spin" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Loading...</p>
                </div>
            </div>
            <Footer />
        </>
    );
}
