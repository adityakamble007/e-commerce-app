/**
 * Cart API Route
 * Handles cart operations for both guest and logged-in users
 */

import { sql, initCartsTable, initCartItemsTable, initProductsTable } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Initialize tables on first request
let tablesInitialized = false;

async function ensureTablesExist() {
    if (!tablesInitialized) {
        await initProductsTable();
        await initCartsTable();
        await initCartItemsTable();
        tablesInitialized = true;
    }
}

/**
 * Get or create cart for user/guest
 * @param {string|null} userId - Clerk user ID
 * @param {string|null} sessionId - Guest session ID
 * @returns {Promise<Object>} Cart record
 */
async function getOrCreateCart(userId, sessionId) {
    // Try to find existing cart
    let cart;

    if (userId) {
        const result = await sql`
            SELECT * FROM carts WHERE user_id = ${userId}
        `;
        cart = result[0];

        if (!cart) {
            const newCart = await sql`
                INSERT INTO carts (user_id) 
                VALUES (${userId})
                RETURNING *
            `;
            cart = newCart[0];
        }
    } else if (sessionId) {
        const result = await sql`
            SELECT * FROM carts WHERE session_id = ${sessionId}
        `;
        cart = result[0];

        if (!cart) {
            const newCart = await sql`
                INSERT INTO carts (session_id) 
                VALUES (${sessionId})
                RETURNING *
            `;
            cart = newCart[0];
        }
    }

    return cart;
}

/**
 * GET /api/cart
 * Fetch cart items for user or guest
 */
export async function GET(req) {
    try {
        await ensureTablesExist();

        const { userId } = await auth();
        const sessionId = req.headers.get("x-session-id");

        if (!userId && !sessionId) {
            return NextResponse.json({
                success: true,
                items: [],
                cartCount: 0,
            });
        }

        const cart = await getOrCreateCart(userId, sessionId);

        if (!cart) {
            return NextResponse.json({
                success: true,
                items: [],
                cartCount: 0,
            });
        }

        // Fetch cart items with product details
        const items = await sql`
            SELECT 
                ci.id,
                ci.quantity,
                ci.added_at,
                p.id as product_id,
                p.title,
                p.price,
                p.original_price,
                p.description,
                p.image_url
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.cart_id = ${cart.id}
            ORDER BY ci.added_at DESC
        `;

        const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

        return NextResponse.json({
            success: true,
            items,
            cartCount,
        });
    } catch (error) {
        console.error("❌ Failed to fetch cart:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch cart" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/cart
 * Add item to cart
 * Body: { productId, quantity }
 */
export async function POST(req) {
    try {
        await ensureTablesExist();

        const { userId } = await auth();
        const sessionId = req.headers.get("x-session-id");

        if (!userId && !sessionId) {
            return NextResponse.json(
                { success: false, error: "Session required" },
                { status: 400 }
            );
        }

        const body = await req.json();
        const { productId, quantity = 1 } = body;

        if (!productId) {
            return NextResponse.json(
                { success: false, error: "Product ID required" },
                { status: 400 }
            );
        }

        // Verify product exists
        const product = await sql`
            SELECT id FROM products WHERE id = ${productId}
        `;

        if (!product[0]) {
            return NextResponse.json(
                { success: false, error: "Product not found" },
                { status: 404 }
            );
        }

        const cart = await getOrCreateCart(userId, sessionId);

        // Upsert cart item (insert or update quantity)
        const result = await sql`
            INSERT INTO cart_items (cart_id, product_id, quantity)
            VALUES (${cart.id}, ${productId}, ${quantity})
            ON CONFLICT (cart_id, product_id)
            DO UPDATE SET quantity = cart_items.quantity + ${quantity}
            RETURNING *
        `;

        // Update cart timestamp
        await sql`
            UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = ${cart.id}
        `;

        return NextResponse.json({
            success: true,
            item: result[0],
        });
    } catch (error) {
        console.error("❌ Failed to add to cart:", error);
        return NextResponse.json(
            { success: false, error: "Failed to add to cart" },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/cart
 * Update item quantity
 * Body: { itemId, quantity }
 */
export async function PATCH(req) {
    try {
        await ensureTablesExist();

        const { userId } = await auth();
        const sessionId = req.headers.get("x-session-id");

        if (!userId && !sessionId) {
            return NextResponse.json(
                { success: false, error: "Session required" },
                { status: 400 }
            );
        }

        const body = await req.json();
        const { itemId, quantity } = body;

        if (!itemId || quantity === undefined) {
            return NextResponse.json(
                { success: false, error: "Item ID and quantity required" },
                { status: 400 }
            );
        }

        if (quantity < 1) {
            return NextResponse.json(
                { success: false, error: "Quantity must be at least 1" },
                { status: 400 }
            );
        }

        // Verify item belongs to user's cart
        const cart = await getOrCreateCart(userId, sessionId);

        const result = await sql`
            UPDATE cart_items 
            SET quantity = ${quantity}
            WHERE id = ${itemId} AND cart_id = ${cart.id}
            RETURNING *
        `;

        if (!result[0]) {
            return NextResponse.json(
                { success: false, error: "Item not found in cart" },
                { status: 404 }
            );
        }

        // Update cart timestamp
        await sql`
            UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = ${cart.id}
        `;

        return NextResponse.json({
            success: true,
            item: result[0],
        });
    } catch (error) {
        console.error("❌ Failed to update cart:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update cart" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/cart
 * Remove item from cart
 * Query: ?itemId=123 or ?clear=true to clear entire cart
 */
export async function DELETE(req) {
    try {
        await ensureTablesExist();

        const { userId } = await auth();
        const sessionId = req.headers.get("x-session-id");

        if (!userId && !sessionId) {
            return NextResponse.json(
                { success: false, error: "Session required" },
                { status: 400 }
            );
        }

        const { searchParams } = new URL(req.url);
        const itemId = searchParams.get("itemId");
        const clear = searchParams.get("clear") === "true";

        const cart = await getOrCreateCart(userId, sessionId);

        if (clear) {
            // Clear entire cart
            await sql`
                DELETE FROM cart_items WHERE cart_id = ${cart.id}
            `;
        } else if (itemId) {
            // Remove specific item
            const result = await sql`
                DELETE FROM cart_items 
                WHERE id = ${itemId} AND cart_id = ${cart.id}
                RETURNING *
            `;

            if (!result[0]) {
                return NextResponse.json(
                    { success: false, error: "Item not found in cart" },
                    { status: 404 }
                );
            }
        } else {
            return NextResponse.json(
                { success: false, error: "Item ID or clear flag required" },
                { status: 400 }
            );
        }

        // Update cart timestamp
        await sql`
            UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = ${cart.id}
        `;

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error("❌ Failed to remove from cart:", error);
        return NextResponse.json(
            { success: false, error: "Failed to remove from cart" },
            { status: 500 }
        );
    }
}
