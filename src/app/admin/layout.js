import AdminSidebar from "@/components/AdminSidebar";
import AdminGuard from "@/components/AdminGuard";

export const metadata = {
    title: "Admin Panel - ShopVibe",
    description: "Manage your ShopVibe store",
};

/**
 * Admin Layout
 * Wraps all admin pages with sidebar and access control
 */
export default function AdminLayout({ children }) {
    return (
        <AdminGuard>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
                <AdminSidebar />

                {/* Main Content Area */}
                <main className="md:ml-64 min-h-screen transition-all duration-300">
                    {children}
                </main>
            </div>
        </AdminGuard>
    );
}
