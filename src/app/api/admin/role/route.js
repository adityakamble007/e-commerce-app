"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { sql, initUserRolesTable, isUserAdmin, getUserRole, setUserRole } from "@/lib/db";

/**
 * GET /api/admin/role
 * Check if current user is admin
 */
export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { success: false, isAdmin: false, error: "Not authenticated" },
                { status: 401 }
            );
        }

        // Initialize table if needed
        await initUserRolesTable();

        const isAdmin = await isUserAdmin(userId);
        const role = await getUserRole(userId);

        return NextResponse.json({
            success: true,
            isAdmin,
            role,
            userId
        });
    } catch (error) {
        console.error("Error checking admin status:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

/**
 * POST /api/admin/role
 * Set up initial admin (for seeding)
 * Body: { email: string }
 */
export async function POST(request) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return NextResponse.json(
                { success: false, error: "Not authenticated" },
                { status: 401 }
            );
        }

        // Initialize table if needed
        await initUserRolesTable();

        const body = await request.json();
        const { action } = body;

        // Self-registration: Check if user email matches admin email
        const userEmail = user.emailAddresses?.[0]?.emailAddress;
        const ADMIN_EMAIL = "www.hp685@gmail.com";

        if (action === "check-and-assign") {
            // Auto-assign admin if email matches
            if (userEmail === ADMIN_EMAIL) {
                await setUserRole(userId, userEmail, "admin");
                return NextResponse.json({
                    success: true,
                    message: "Admin role assigned",
                    role: "admin"
                });
            } else {
                // Ensure user has at least 'user' role
                const currentRole = await getUserRole(userId);
                if (!currentRole || currentRole === 'user') {
                    await setUserRole(userId, userEmail, "user");
                }
                return NextResponse.json({
                    success: true,
                    message: "User role confirmed",
                    role: "user"
                });
            }
        }

        return NextResponse.json(
            { success: false, error: "Invalid action" },
            { status: 400 }
        );
    } catch (error) {
        console.error("Error in role management:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
