/**
 * Checkout Address API Route
 * Handles saving and loading user shipping/contact information
 */

import { sql, initUserAddressesTable } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Initialize table on first request
let tableInitialized = false;

async function ensureTableExists() {
    if (!tableInitialized) {
        await initUserAddressesTable();
        tableInitialized = true;
    }
}

/**
 * GET /api/checkout/address
 * Fetch saved address for logged-in user
 */
export async function GET() {
    try {
        await ensureTableExists();

        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({
                success: false,
                error: "Authentication required",
            }, { status: 401 });
        }

        const result = await sql`
            SELECT 
                full_name,
                email,
                phone_country_code,
                phone_number,
                address_line1,
                address_line2,
                city,
                state,
                postal_code,
                country
            FROM user_addresses 
            WHERE user_id = ${userId}
        `;

        const address = result[0] || null;

        return NextResponse.json({
            success: true,
            address,
        });
    } catch (error) {
        console.error("❌ Failed to fetch address:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch address" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/checkout/address
 * Save or update address for logged-in user
 * Body: { fullName, email, phoneCountryCode, phoneNumber, addressLine1, 
 *         addressLine2, city, state, postalCode, country }
 */
export async function POST(req) {
    try {
        await ensureTableExists();

        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({
                success: false,
                error: "Authentication required",
            }, { status: 401 });
        }

        const body = await req.json();
        const {
            fullName,
            email,
            phoneCountryCode,
            phoneNumber,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
            country,
        } = body;

        // Upsert address (insert or update)
        const result = await sql`
            INSERT INTO user_addresses (
                user_id,
                full_name,
                email,
                phone_country_code,
                phone_number,
                address_line1,
                address_line2,
                city,
                state,
                postal_code,
                country,
                updated_at
            ) VALUES (
                ${userId},
                ${fullName || null},
                ${email || null},
                ${phoneCountryCode || null},
                ${phoneNumber || null},
                ${addressLine1 || null},
                ${addressLine2 || null},
                ${city || null},
                ${state || null},
                ${postalCode || null},
                ${country || null},
                CURRENT_TIMESTAMP
            )
            ON CONFLICT (user_id)
            DO UPDATE SET
                full_name = EXCLUDED.full_name,
                email = EXCLUDED.email,
                phone_country_code = EXCLUDED.phone_country_code,
                phone_number = EXCLUDED.phone_number,
                address_line1 = EXCLUDED.address_line1,
                address_line2 = EXCLUDED.address_line2,
                city = EXCLUDED.city,
                state = EXCLUDED.state,
                postal_code = EXCLUDED.postal_code,
                country = EXCLUDED.country,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *
        `;

        return NextResponse.json({
            success: true,
            address: result[0],
        });
    } catch (error) {
        console.error("❌ Failed to save address:", error);
        return NextResponse.json(
            { success: false, error: "Failed to save address" },
            { status: 500 }
        );
    }
}
