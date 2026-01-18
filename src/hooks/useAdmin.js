"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";

/**
 * Custom hook to check if current user is admin
 * @returns {{ isAdmin: boolean, isLoading: boolean, error: string | null, checkAdminStatus: () => Promise<void> }}
 */
export function useAdmin() {
    const { user, isLoaded: isUserLoaded } = useUser();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const checkAdminStatus = useCallback(async () => {
        if (!isUserLoaded) return;

        if (!user) {
            setIsAdmin(false);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            // First, trigger role check/assignment
            const assignResponse = await fetch("/api/admin/role", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "check-and-assign" }),
            });

            if (!assignResponse.ok) {
                throw new Error("Failed to check role assignment");
            }

            // Then get current admin status
            const response = await fetch("/api/admin/role");
            const data = await response.json();

            if (data.success) {
                setIsAdmin(data.isAdmin);
            } else {
                setError(data.error || "Failed to check admin status");
                setIsAdmin(false);
            }
        } catch (err) {
            console.error("Error checking admin status:", err);
            setError(err.message);
            setIsAdmin(false);
        } finally {
            setIsLoading(false);
        }
    }, [user, isUserLoaded]);

    useEffect(() => {
        checkAdminStatus();
    }, [checkAdminStatus]);

    return { isAdmin, isLoading, error, checkAdminStatus };
}

export default useAdmin;
