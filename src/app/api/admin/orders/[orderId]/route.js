/**
 * Admin Order Status Update API Route
 * PATCH - Update order status (admin only)
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { updateOrderStatus, isUserAdmin } from "@/lib/db";

/**
 * PATCH /api/admin/orders/[orderId]
 * Update order status
 * Body: { status: 'processing' | 'shipping' | 'delivered' }
 */
export async function PATCH(request, { params }) {
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

        const { orderId } = await params;
        const body = await request.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json(
                { success: false, error: "Status is required" },
                { status: 400 }
            );
        }

        const order = await updateOrderStatus(parseInt(orderId), status);

        return NextResponse.json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
