/**
 * UploadThing FileRouter Configuration
 * Defines upload endpoints and permissions for the application
 */

import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

/**
 * FileRouter for the application
 * Defines file upload routes and their configurations
 */
export const ourFileRouter = {
    // Product image uploader route
    productImage: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1,
        },
    })
        .middleware(async ({ req }) => {
            // Add authentication logic here if needed
            // For now, allowing all uploads
            return {};
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This runs on the server after upload completes
            console.log("✅ Upload complete:", file.ufsUrl);

            // Return the file URL to the client
            return { url: file.ufsUrl };
        }),
};

export default ourFileRouter;
