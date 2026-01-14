/**
 * Products API Route
 * Handles product creation with database storage
 */

import { sql, initProductsTable } from "@/lib/db";
import { NextResponse } from "next/server";

// Initialize the products table on first request
let tableInitialized = false;

async function ensureTableExists() {
    if (!tableInitialized) {
        await initProductsTable();
        tableInitialized = true;
    }
}

/**
 * POST /api/products
 * Creates a new product with the uploaded image URL
 */
export async function POST(req) {
    try {
        // Ensure table exists
        await ensureTableExists();

        const body = await req.json();
        const { title, price, originalPrice, description, imageUrl } = body;

        // Validate required fields
        if (!title || !price || !description || !imageUrl) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Missing required fields: title, price, description, imageUrl",
                },
                { status: 400 }
            );
        }

        // Validate price is a positive number
        const priceNum = parseFloat(price);
        if (isNaN(priceNum) || priceNum < 0) {
            return NextResponse.json(
                { success: false, error: "Price must be a positive number" },
                { status: 400 }
            );
        }

        // Parse original price (optional)
        const originalPriceNum = originalPrice
            ? parseFloat(originalPrice)
            : null;

        // Insert product into database
        const result = await sql`
            INSERT INTO products (title, price, original_price, description, image_url)
            VALUES (${title}, ${priceNum}, ${originalPriceNum}, ${description}, ${imageUrl})
            RETURNING *
        `;

        console.log("✅ Product created:", result[0]);

        return NextResponse.json({
            success: true,
            product: result[0],
        });
    } catch (error) {
        console.error("❌ Failed to create product:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to save product. Please try again.",
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/products
 * Retrieves all products (for future use)
 */
export async function GET() {
    try {
        await ensureTableExists();

        const products = await sql`
            SELECT * FROM products 
            ORDER BY created_at DESC
        `;

        return NextResponse.json({
            success: true,
            products,
        });
    } catch (error) {
        console.error("❌ Failed to fetch products:", error);

        return NextResponse.json(
            { success: false, error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}
