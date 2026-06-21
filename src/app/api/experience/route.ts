import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

export async function GET() {
  try {
    const db = initDb();
    const experience = db.prepare('SELECT * FROM experience ORDER BY id DESC').all();
    return NextResponse.json({ success: true, data: experience });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { company, role, duration, description } = body;
    const db = initDb();
    
    const stmt = db.prepare('INSERT INTO experience (company, role, duration, description) VALUES (?, ?, ?, ?)');
    const info = stmt.run(company, role, duration, description);
    
    return NextResponse.json({ success: true, id: info.lastInsertRowid });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, company, role, duration, description } = body;
    if (!id) throw new Error('ID required for updating');

    const db = initDb();
    const stmt = db.prepare('UPDATE experience SET company = ?, role = ?, duration = ?, description = ? WHERE id = ?');
    stmt.run(company, role, duration, description, id);
    
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
    const stmt = db.prepare('DELETE FROM experience WHERE id = ?');
    stmt.run(id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
