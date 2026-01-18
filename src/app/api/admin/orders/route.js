/**
 * Admin Orders API Route
 * GET - Fetch all orders (admin only)
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAllOrders, isUserAdmin } from "@/lib/db";

/**
 * GET /api/admin/orders
 * Fetch all orders for admin management
 */
export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Authentication required" },
                { status: 401 }
            );
        }

        // Check if user is admin
        const isAdmin = await isUserAdmin(userId);
        if (!isAdmin) {
            return NextResponse.json(
                { success: false, error: "Admin access required" },
                { status: 403 }
            );
        }

        const orders = await getAllOrders();

        return NextResponse.json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
