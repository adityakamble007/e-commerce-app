/**
 * Neon Postgres Database Configuration
 * Production-grade database client with connection pooling and error handling
 */

import { neon, neonConfig } from '@neondatabase/serverless';

// Configure Neon for optimal performance
neonConfig.fetchConnectionCache = true;

/**
 * Get the database connection string from environment variables
 * @throws {Error} If DATABASE_URL is not configured
 */
function getDatabaseUrl() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error(
            'DATABASE_URL environment variable is not set. ' +
            'Please add your Neon connection string to .env.local'
        );
    }

    return databaseUrl;
}

/**
 * Create a SQL query executor connected to Neon Postgres
 * Uses serverless-friendly connection pooling
 */
export const sql = neon(getDatabaseUrl());

/**
 * Execute a raw SQL query with error handling
 * @param {string} query - SQL query string
 * @param {Array} params - Query parameters for prepared statements
 * @returns {Promise<Array>} Query results
 */
export async function executeQuery(query, params = []) {
    try {
        const result = await sql(query, params);
        return result;
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error(`Database query failed: ${error.message}`);
    }
}

/**
 * Health check function to verify database connectivity
 * @returns {Promise<boolean>} True if connection is successful
 */
export async function checkDatabaseConnection() {
    try {
        await sql`SELECT 1 as health_check`;
        return true;
    } catch (error) {
        console.error('Database connection check failed:', error);
        return false;
    }
}

/**
 * Transaction helper for executing multiple queries atomically
 * Note: Full transaction support requires @neondatabase/serverless with websocket
 * For complex transactions, consider using Drizzle ORM or Prisma
 * @param {Function} callback - Async function containing queries to execute
 * @returns {Promise<any>} Result of the callback
 */
export async function withTransaction(callback) {
    try {
        await sql`BEGIN`;
        const result = await callback(sql);
        await sql`COMMIT`;
        return result;
    } catch (error) {
        await sql`ROLLBACK`;
        console.error('Transaction failed, rolled back:', error);
        throw error;
    }
}

export default sql;
