/**
 * UploadThing API Route Handler
 * Handles GET and POST requests for file uploads
 */

import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Export routes for Next.js App Router
export const { GET, POST } = createRouteHandler({
    router: ourFileRouter,
});
