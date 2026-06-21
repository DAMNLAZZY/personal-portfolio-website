import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

export async function GET() {
  try {
    const db = initDb();
    const projects = db.prepare('SELECT * FROM projects').all();
    return NextResponse.json({ success: true, data: projects });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, image, link, tags } = body;
    const db = initDb();
    
    const stmt = db.prepare('INSERT INTO projects (title, description, image, link, tags) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(title, description, image || '', link || '', tags || '');
    
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
    const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
    stmt.run(id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
