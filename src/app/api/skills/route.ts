import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

export async function GET() {
  try {
    const db = initDb();
    const skills = db.prepare('SELECT * FROM skills ORDER BY level DESC').all();
    return NextResponse.json({ success: true, data: skills });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, level, category } = body;
    const db = initDb();
    
    const stmt = db.prepare('INSERT INTO skills (name, level, category) VALUES (?, ?, ?)');
    const info = stmt.run(name, level, category || '');
    
    return NextResponse.json({ success: true, id: info.lastInsertRowid });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) throw new Error('ID required');

    const db = initDb();
    const stmt = db.prepare('DELETE FROM skills WHERE id = ?');
    stmt.run(id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
