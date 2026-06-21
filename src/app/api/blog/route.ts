import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

export async function GET() {
  try {
    const db = initDb();
    const blog = db.prepare('SELECT * FROM blog ORDER BY id DESC').all();
    return NextResponse.json({ success: true, data: blog });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, date } = body;
    const db = initDb();
    
    const stmt = db.prepare('INSERT INTO blog (title, content, date) VALUES (?, ?, ?)');
    const info = stmt.run(title, content, date || new Date().toLocaleDateString());
    
    return NextResponse.json({ success: true, id: info.lastInsertRowid });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, content, date } = body;
    if (!id) throw new Error('ID required for updating');

    const db = initDb();
    const stmt = db.prepare('UPDATE blog SET title = ?, content = ?, date = ? WHERE id = ?');
    stmt.run(title, content, date, id);
    
    return NextResponse.json({ success: true });
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
    const stmt = db.prepare('DELETE FROM blog WHERE id = ?');
    stmt.run(id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
