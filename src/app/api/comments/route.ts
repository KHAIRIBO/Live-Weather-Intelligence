import { NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initDb();
    dbInitialized = true;
  }
}

// GET: Fetch comments (optional filtering by city)
export async function GET(request: Request) {
  try {
    await ensureDbInitialized();

    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');

    let query = 'SELECT * FROM weather_comments';
    const params: any[] = [];

    if (city) {
      query += ' WHERE city = $1';
      params.push(city);
    }

    query += ' ORDER BY created_at DESC LIMIT 100';

    const result = await db.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments', details: error.message },
      { status: 500 }
    );
  }
}

// POST: Add a new comment
export async function POST(request: Request) {
  try {
    await ensureDbInitialized();

    const body = await request.json();
    const { name, comment, city, country } = body;

    // Validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!comment || typeof comment !== 'string' || !comment.trim()) {
      return NextResponse.json({ error: 'Comment is required' }, { status: 400 });
    }
    if (!city || typeof city !== 'string' || !city.trim()) {
      return NextResponse.json({ error: 'City is required' }, { status: 400 });
    }

    const trimmedName = name.trim().substring(0, 100);
    const trimmedComment = comment.trim().substring(0, 1000);
    const trimmedCity = city.trim().substring(0, 100);
    const trimmedCountry = country ? country.trim().substring(0, 100) : null;

    const query = `
      INSERT INTO weather_comments (name, comment, city, country)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const params = [trimmedName, trimmedComment, trimmedCity, trimmedCountry];

    const result = await db.query(query, params);
    const newComment = result.rows[0];

    return NextResponse.json(newComment, { status: 201 });
  } catch (error: any) {
    console.error('Error creating comment:', error);
    const isReadOnly = error.message && (error.message.includes('read-only') || error.message.includes('read_only'));
    return NextResponse.json(
      { 
        error: isReadOnly 
          ? 'Cannot submit comments: The database is currently in read-only mode (common for local dev, Netlify preview branches, or database replicas).' 
          : 'Failed to submit comment', 
        details: error.message 
      },
      { status: isReadOnly ? 403 : 500 }
    );
  }
}
