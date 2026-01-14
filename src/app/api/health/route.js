/**
 * Database Health Check API Route
 * GET /api/health - Check database connectivity
 */

import { checkDatabaseConnection, sql } from '@/lib/db';

export async function GET() {
    try {
        const isConnected = await checkDatabaseConnection();

        if (isConnected) {
            // Get database version for additional info
            const versionResult = await sql`SELECT version()`;

            return Response.json({
                status: 'healthy',
                database: 'connected',
                timestamp: new Date().toISOString(),
                version: versionResult[0]?.version || 'unknown'
            }, { status: 200 });
        }

        return Response.json({
            status: 'unhealthy',
            database: 'disconnected',
            timestamp: new Date().toISOString(),
            error: 'Failed to connect to database'
        }, { status: 503 });

    } catch (error) {
        console.error('Health check error:', error);

        return Response.json({
            status: 'error',
            database: 'error',
            timestamp: new Date().toISOString(),
            error: error.message
        }, { status: 500 });
    }
}
