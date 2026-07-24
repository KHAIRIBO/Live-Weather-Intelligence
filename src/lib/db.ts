import { Pool } from 'pg';

let pool: Pool;

const connectionString = process.env.DATABASE_URL;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  // Prevent multiple pools during development hot reloads
  if (!(global as any)._pgPool) {
    (global as any)._pgPool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }
  pool = (global as any)._pgPool;
}

export const db = pool;

// Automatically initialize comments table if it does not exist
export async function initDb() {
  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS weather_comments (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          comment TEXT NOT NULL,
          city VARCHAR(100) NOT NULL,
          country VARCHAR(100),
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ PostgreSQL Comments table verified/created.');
    } finally {
      client.release();
    }
  } catch (error: any) {
    if (error.message && (error.message.includes('read-only') || error.message.includes('read_only'))) {
      console.warn('⚠️ Database connection is in read-only mode. Skipping table initialization. (This is normal for Netlify preview branches or database replicas)');
    } else {
      console.error('❌ Failed to initialize database comments table:', error);
    }
  }
}
