/**
 * Orders API Route
 * GET - Fetch orders for current user
 * POST - Create order after successful payment
 */

import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createOrder, getOrdersByUserId } from "@/lib/db";

/**
 * GET /api/orders
 * Fetch all orders for the current authenticated user
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

        const orders = await getOrdersByUserId(userId);

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

/**
 * POST /api/orders
 * Create a new order after successful payment
 * Body: { items, subtotal, shipping, tax, total, paymentIntentId, shippingAddress }
 */
export async function POST(request) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return NextResponse.json(
                { success: false, error: "Authentication required" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { items, subtotal, shipping, tax, total, paymentIntentId, shippingAddress } = body;

        // Validate required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { success: false, error: "Items are required" },
                { status: 400 }
            );
        }

        if (!total || total <= 0) {
            return NextResponse.json(
                { success: false, error: "Valid total is required" },
                { status: 400 }
            );
        }

        const userEmail = user.emailAddresses?.[0]?.emailAddress || null;

        const order = await createOrder({
            userId,
            userEmail,
            items,
            subtotal: subtotal || 0,
            shipping: shipping || 0,
            tax: tax || 0,
            total,
            paymentIntentId: paymentIntentId || null,
            shippingAddress: shippingAddress || null,
        });

        return NextResponse.json({
            success: true,
            order,
            orderNumber: order.order_number,
        });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
