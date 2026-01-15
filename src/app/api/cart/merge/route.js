/**
 * Cart Merge API Route
 * Merges guest cart into user cart on login
 */

import { sql, initCartsTable, initCartItemsTable } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Initialize tables on first request
let tablesInitialized = false;

async function ensureTablesExist() {
    if (!tablesInitialized) {
        await initCartsTable();
        await initCartItemsTable();
        tablesInitialized = true;
    }
}

/**
 * POST /api/cart/merge
 * Merge guest cart into logged-in user's cart
 * Body: { sessionId }
 */
export async function POST(req) {
    try {
        await ensureTablesExist();

        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Authentication required" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { sessionId } = body;

        if (!sessionId) {
            return NextResponse.json({
                success: true,
                message: "No guest session to merge",
            });
        }

        // Find guest cart
        const guestCartResult = await sql`
            SELECT * FROM carts WHERE session_id = ${sessionId}
        `;
        const guestCart = guestCartResult[0];

        if (!guestCart) {
            return NextResponse.json({
                success: true,
                message: "No guest cart found",
            });
        }

        // Get guest cart items
        const guestItems = await sql`
            SELECT * FROM cart_items WHERE cart_id = ${guestCart.id}
        `;

        if (guestItems.length === 0) {
            // Delete empty guest cart
            await sql`DELETE FROM carts WHERE id = ${guestCart.id}`;
            return NextResponse.json({
                success: true,
                message: "Guest cart was empty",
            });
        }

        // Get or create user cart
        let userCartResult = await sql`
            SELECT * FROM carts WHERE user_id = ${userId}
        `;
        let userCart = userCartResult[0];

        if (!userCart) {
            const newCart = await sql`
                INSERT INTO carts (user_id)
                VALUES (${userId})
                RETURNING *
            `;
            userCart = newCart[0];
        }

        // Merge items: for each guest item, add to user cart or update quantity
        for (const guestItem of guestItems) {
            await sql`
                INSERT INTO cart_items (cart_id, product_id, quantity)
                VALUES (${userCart.id}, ${guestItem.product_id}, ${guestItem.quantity})
                ON CONFLICT (cart_id, product_id)
                DO UPDATE SET quantity = cart_items.quantity + ${guestItem.quantity}
            `;
        }

        // Delete guest cart items and cart
        await sql`DELETE FROM cart_items WHERE cart_id = ${guestCart.id}`;
        await sql`DELETE FROM carts WHERE id = ${guestCart.id}`;

        // Update user cart timestamp
        await sql`
            UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = ${userCart.id}
        `;

        console.log(`✅ Merged ${guestItems.length} items from guest cart to user ${userId}`);

        return NextResponse.json({
            success: true,
            message: `Merged ${guestItems.length} items`,
            mergedCount: guestItems.length,
        });
    } catch (error) {
        console.error("❌ Failed to merge carts:", error);
        return NextResponse.json(
            { success: false, error: "Failed to merge carts" },
            { status: 500 }
        );
    }
}
