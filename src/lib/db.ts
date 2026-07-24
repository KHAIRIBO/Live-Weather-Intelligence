import { Pool } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }
  return new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
    // Keep connections alive
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });
}

// Singleton pool — reuse across hot reloads in dev, new pool per process in prod
export const db: Pool =
  process.env.NODE_ENV === 'production'
    ? createPool()
    : (global._pgPool ??= createPool());

// Auto-create the comments table on first connection
export async function initDb(): Promise<void> {
  const client = await db.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS weather_comments (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(100)     NOT NULL,
        comment    TEXT             NOT NULL,
        city       VARCHAR(100)     NOT NULL,
        country    VARCHAR(100),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ weather_comments table ready.');
  } catch (error: any) {
    const msg: string = error?.message ?? '';
    if (msg.includes('read-only') || msg.includes('read_only')) {
      console.warn('⚠️ DB is read-only — skipping table creation (expected on Netlify preview branches).');
    } else {
      // Re-throw so the caller knows init failed
      throw error;
    }
  } finally {
    client.release();
  }
}
