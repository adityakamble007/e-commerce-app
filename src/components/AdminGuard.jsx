"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useAdmin } from "@/hooks/useAdmin";

/**
 * AdminGuard Component
 * Protects admin routes by checking user role and redirecting non-admins
 */
export default function AdminGuard({ children }) {
    const router = useRouter();
    const { user, isLoaded: isUserLoaded } = useUser();
    const { isAdmin, isLoading } = useAdmin();

    useEffect(() => {
        if (!isUserLoaded || isLoading) return;

        // Not logged in
        if (!user) {
            router.push("/");
            return;
        }

        // Logged in but not admin
        if (!isAdmin) {
            router.push("/");
        }
    }, [user, isUserLoaded, isAdmin, isLoading, router]);

    // Show loading state
    if (!isUserLoaded || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center animate-pulse">
                        <svg
                            className="w-8 h-8 text-white animate-spin"
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
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                        Verifying access...
                    </p>
                </div>
            </div>
        );
    }

    // Not authorized
    if (!user || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md mx-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Access Denied
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        You don't have permission to access this page.
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 hover:-translate-y-0.5"
                    >
                        Go Back Home
                    </button>
                </div>
            </div>
        );
    }

    // Authorized - render children
    return <>{children}</>;
}
