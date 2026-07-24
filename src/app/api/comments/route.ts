import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET: Fetch all comments (optionally filtered by ?city=CityName)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');

    const rows = city
      ? await db.sql`SELECT * FROM weather_comments WHERE city = ${city} ORDER BY created_at DESC LIMIT 100`
      : await db.sql`SELECT * FROM weather_comments ORDER BY created_at DESC LIMIT 100`;

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments', details: error.message },
      { status: 500 }
    );
  }
}

// POST: Submit a new comment
export async function POST(request: Request) {
  // Parse body first — before any async DB work to avoid stream issues
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

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

  try {
    const trimmedName    = name.trim().substring(0, 100);
    const trimmedComment = comment.trim().substring(0, 1000);
    const trimmedCity    = city.trim().substring(0, 100);
    const trimmedCountry = country ? String(country).trim().substring(0, 100) : null;

    const [inserted] = await db.sql`
      INSERT INTO weather_comments (name, comment, city, country)
      VALUES (${trimmedName}, ${trimmedComment}, ${trimmedCity}, ${trimmedCountry})
      RETURNING *
    `;

    return NextResponse.json(inserted, { status: 201 });
  } catch (error: any) {
    console.error('Error creating comment:', error);
    const isReadOnly =
      error.message &&
      (error.message.includes('read-only') || error.message.includes('read_only'));

    return NextResponse.json(
      {
        error: isReadOnly
          ? 'The database is currently in read-only mode. Comments cannot be saved right now.'
          : 'Failed to submit comment',
        details: error.message,
      },
      { status: isReadOnly ? 403 : 500 }
    );
  }
}
