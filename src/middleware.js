import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
    "/",
    "/products(.*)",
    "/cart(.*)",
    "/checkout(.*)",
    "/payment(.*)",
    "/orders(.*)",
    "/api/products(.*)",
    "/api/cart(.*)",
    "/api/uploadthing(.*)",
    "/sign-in(.*)",
    "/sign-up(.*)",
]);

// Admin routes require authentication (role check happens client-side)
const isAdminRoute = createRouteMatcher([
    "/admin(.*)",
    "/api/admin(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
    // Protect non-public routes
    if (!isPublicRoute(request)) {
        await auth.protect();
    }
});


export const config = {
    matcher: [
        // Skip Next.js internals and static files
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
