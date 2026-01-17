/**
 * Stripe Payment Intent API Route
 * Creates a payment intent for processing payments
 */

import Stripe from "stripe";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-12-18.acacia",
});

/**
 * POST /api/payment/create-intent
 * Create a payment intent for the given amount
 * Body: { amount } - amount in dollars (will be converted to cents)
 */
export async function POST(req) {
    try {
        // Verify user is authenticated
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Authentication required" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { amount } = body;

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { success: false, error: "Valid amount required" },
                { status: 400 }
            );
        }

        // Convert dollars to cents for Stripe
        const amountInCents = Math.round(amount * 100);

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: "usd",
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                userId: userId,
            },
        });

        return NextResponse.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("❌ Failed to create payment intent:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to create payment intent" },
            { status: 500 }
        );
    }
}
