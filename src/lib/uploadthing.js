/**
 * UploadThing React Components
 * Generated upload components for use in the application
 */

import {
    generateUploadButton,
    generateUploadDropzone,
    generateReactHelpers,
} from "@uploadthing/react";

// Generate typed upload components
export const UploadButton = generateUploadButton();
export const UploadDropzone = generateUploadDropzone();

// Generate React helpers for custom upload implementations
export const { useUploadThing } = generateReactHelpers();
