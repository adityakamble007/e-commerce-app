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
 * Get all products
 * @returns {Promise<Array>} List of products
 */
export async function getProducts() {
    try {
        await initProductsTable();
        const products = await sql`
            SELECT * FROM products 
            ORDER BY created_at DESC
        `;
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
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

// ============================================
// ORDERS FUNCTIONS
// ============================================

/**
 * Initialize the orders table
 * @returns {Promise<void>}
 */
export async function initOrdersTable() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                order_number VARCHAR(50) UNIQUE NOT NULL,
                user_id VARCHAR(255) NOT NULL,
                user_email VARCHAR(255),
                status VARCHAR(50) DEFAULT 'processing',
                subtotal DECIMAL(10, 2) NOT NULL,
                shipping DECIMAL(10, 2) DEFAULT 0,
                tax DECIMAL(10, 2) DEFAULT 0,
                total DECIMAL(10, 2) NOT NULL,
                payment_intent_id VARCHAR(255),
                shipping_address JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        console.log('✅ Orders table initialized');
    } catch (error) {
        console.error('❌ Failed to initialize orders table:', error);
        throw error;
    }
}

/**
 * Initialize the order_items table
 * @returns {Promise<void>}
 */
export async function initOrderItemsTable() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS order_items (
                id SERIAL PRIMARY KEY,
                order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
                product_id INTEGER,
                product_title VARCHAR(255) NOT NULL,
                product_price DECIMAL(10, 2) NOT NULL,
                product_image VARCHAR(500),
                quantity INTEGER NOT NULL DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        console.log('✅ Order items table initialized');
    } catch (error) {
        console.error('❌ Failed to initialize order_items table:', error);
        throw error;
    }
}

/**
 * Generate unique order number
 * @returns {string}
 */
function generateOrderNumber() {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${year}-${random}`;
}

/**
 * Create a new order with items
 * @param {Object} orderData - Order data
 * @returns {Promise<Object>} Created order
 */
export async function createOrder({
    userId,
    userEmail,
    items,
    subtotal,
    shipping,
    tax,
    total,
    paymentIntentId,
    shippingAddress
}) {
    try {
        await initOrdersTable();
        await initOrderItemsTable();

        const orderNumber = generateOrderNumber();

        // Insert order
        const orderResult = await sql`
            INSERT INTO orders (
                order_number, user_id, user_email, status,
                subtotal, shipping, tax, total,
                payment_intent_id, shipping_address
            )
            VALUES (
                ${orderNumber}, ${userId}, ${userEmail}, 'processing',
                ${subtotal}, ${shipping}, ${tax}, ${total},
                ${paymentIntentId}, ${JSON.stringify(shippingAddress)}
            )
            RETURNING *
        `;

        const order = orderResult[0];

        // Insert order items
        for (const item of items) {
            await sql`
                INSERT INTO order_items (
                    order_id, product_id, product_title,
                    product_price, product_image, quantity
                )
                VALUES (
                    ${order.id}, ${item.product_id || null}, ${item.title},
                    ${item.price}, ${item.image_url || null}, ${item.quantity}
                )
            `;
        }

        console.log(`✅ Order created: ${orderNumber}`);
        return order;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

/**
 * Get orders for a specific user
 * @param {string} userId - Clerk user ID
 * @returns {Promise<Array>} User's orders with items
 */
export async function getOrdersByUserId(userId) {
    try {
        await initOrdersTable();

        const orders = await sql`
            SELECT * FROM orders
            WHERE user_id = ${userId}
            ORDER BY created_at DESC
        `;

        // Fetch items for each order
        for (const order of orders) {
            const items = await sql`
                SELECT * FROM order_items
                WHERE order_id = ${order.id}
            `;
            order.items = items;
        }

        return orders;
    } catch (error) {
        console.error('Error fetching user orders:', error);
        throw error;
    }
}

/**
 * Get all orders (for admin)
 * @returns {Promise<Array>} All orders with items
 */
export async function getAllOrders() {
    try {
        await initOrdersTable();

        const orders = await sql`
            SELECT * FROM orders
            ORDER BY created_at DESC
        `;

        // Fetch items for each order
        for (const order of orders) {
            const items = await sql`
                SELECT * FROM order_items
                WHERE order_id = ${order.id}
            `;
            order.items = items;
        }

        return orders;
    } catch (error) {
        console.error('Error fetching all orders:', error);
        throw error;
    }
}

/**
 * Get single order by ID
 * @param {number} orderId - Order ID
 * @returns {Promise<Object|null>} Order with items
 */
export async function getOrderById(orderId) {
    try {
        const orders = await sql`
            SELECT * FROM orders WHERE id = ${orderId}
        `;

        if (orders.length === 0) return null;

        const order = orders[0];
        const items = await sql`
            SELECT * FROM order_items WHERE order_id = ${order.id}
        `;
        order.items = items;

        return order;
    } catch (error) {
        console.error('Error fetching order:', error);
        throw error;
    }
}

/**
 * Update order status (admin)
 * @param {number} orderId - Order ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated order
 */
export async function updateOrderStatus(orderId, status) {
    try {
        const validStatuses = ['processing', 'shipping', 'delivered'];
        if (!validStatuses.includes(status)) {
            throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
        }

        const result = await sql`
            UPDATE orders
            SET status = ${status}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${orderId}
            RETURNING *
        `;

        if (result.length === 0) {
            throw new Error('Order not found');
        }

        console.log(`✅ Order ${orderId} status updated to: ${status}`);
        return result[0];
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
}

export default sql;

