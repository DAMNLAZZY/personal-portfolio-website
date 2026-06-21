import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

export async function GET() {
  try {
    const db = initDb();
    const info = db.prepare('SELECT * FROM general_info LIMIT 1').get();
    return NextResponse.json({ success: true, data: info });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, title, about } = body;
    const db = initDb();
    
    // Check if exists
    const existing = db.prepare('SELECT id FROM general_info LIMIT 1').get() as { id: number } | undefined;
    
    if (existing) {
      const stmt = db.prepare('UPDATE general_info SET name = ?, title = ?, about = ? WHERE id = ?');
      stmt.run(name, title, about, existing.id);
    } else {
      const stmt = db.prepare('INSERT INTO general_info (name, title, about) VALUES (?, ?, ?)');
      stmt.run(name, title, about);
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
