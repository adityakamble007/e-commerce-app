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
        console.log('✅ Neon Postgres connected successfully');
        return true;
    } catch (error) {
        console.error('❌ Database connection check failed:', error);
        return false;
    }
}

// Log initialization status
console.log('🔌 Neon Postgres database client initialized');

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

/**
 * Initialize the products table
 * Creates the table if it doesn't exist
 * @returns {Promise<void>}
 */
export async function initProductsTable() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                original_price DECIMAL(10, 2),
                description TEXT NOT NULL,
                image_url TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        console.log('✅ Products table initialized');
    } catch (error) {
        console.error('❌ Failed to initialize products table:', error);
        throw error;
    }
}

/**
 * Initialize the carts table
 * Supports both guest users (via session_id) and logged-in users (via user_id)
 * @returns {Promise<void>}
 */
export async function initCartsTable() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS carts (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) UNIQUE,
                session_id VARCHAR(255) UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        console.log('✅ Carts table initialized');
    } catch (error) {
        console.error('❌ Failed to initialize carts table:', error);
        throw error;
    }
}

/**
 * Initialize the cart_items table
 * Links cart items to carts and products
 * @returns {Promise<void>}
 */
export async function initCartItemsTable() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS cart_items (
                id SERIAL PRIMARY KEY,
                cart_id INTEGER REFERENCES carts(id) ON DELETE CASCADE,
                product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
                quantity INTEGER NOT NULL DEFAULT 1,
                added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(cart_id, product_id)
            )
        `;
        console.log('✅ Cart items table initialized');
    } catch (error) {
        console.error('❌ Failed to initialize cart_items table:', error);
        throw error;
    }
}

/**
 * Initialize the user_addresses table
 * Stores shipping and contact info for logged-in users
 * @returns {Promise<void>}
 */
export async function initUserAddressesTable() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS user_addresses (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL UNIQUE,
                full_name VARCHAR(255),
                email VARCHAR(255),
                phone_country_code VARCHAR(10),
                phone_number VARCHAR(50),
                address_line1 VARCHAR(255),
                address_line2 VARCHAR(255),
                city VARCHAR(100),
                state VARCHAR(100),
                postal_code VARCHAR(20),
                country VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        console.log('✅ User addresses table initialized');
    } catch (error) {
        console.error('❌ Failed to initialize user_addresses table:', error);
        throw error;
    }
}

/**
 * Initialize the user_roles table
 * Stores user roles for access control (default: 'user', admin: 'admin')
 * @returns {Promise<void>}
 */
export async function initUserRolesTable() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS user_roles (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        console.log('✅ User roles table initialized');
    } catch (error) {
        console.error('❌ Failed to initialize user_roles table:', error);
        throw error;
    }
}

/**
 * Check if a user has admin role
 * @param {string} userId - Clerk user ID
 * @returns {Promise<boolean>}
 */
export async function isUserAdmin(userId) {
    if (!userId) return false;
    try {
        const result = await sql`
            SELECT role FROM user_roles 
            WHERE user_id = ${userId} AND role = 'admin'
        `;
        return result.length > 0;
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

/**
 * Get user role
 * @param {string} userId - Clerk user ID
 * @returns {Promise<string>} - 'admin', 'user', or 'user' (default)
 */
export async function getUserRole(userId) {
    if (!userId) return 'user';
    try {
        const result = await sql`
            SELECT role FROM user_roles WHERE user_id = ${userId}
        `;
        return result.length > 0 ? result[0].role : 'user';
    } catch (error) {
        console.error('Error getting user role:', error);
        return 'user';
    }
}

/**
 * Set user role
 * @param {string} userId - Clerk user ID
 * @param {string} email - User email
 * @param {string} role - Role to set ('user' or 'admin')
 * @returns {Promise<void>}
 */
export async function setUserRole(userId, email, role = 'user') {
    try {
        await sql`
            INSERT INTO user_roles (user_id, email, role, updated_at)
            VALUES (${userId}, ${email}, ${role}, CURRENT_TIMESTAMP)
            ON CONFLICT (user_id) 
            DO UPDATE SET role = ${role}, email = ${email}, updated_at = CURRENT_TIMESTAMP
        `;
        console.log(`✅ User role set: ${email} -> ${role}`);
    } catch (error) {
        console.error('Error setting user role:', error);
        throw error;
    }
}

export default sql;

