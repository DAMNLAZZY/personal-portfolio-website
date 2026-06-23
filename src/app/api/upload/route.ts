import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create uploads folder
    const uploadsDir = process.env.DATA_DIR 
      ? path.resolve(process.env.DATA_DIR, 'uploads')
      : path.join(process.cwd(), 'uploads');
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
    } catch (err) {
      console.error('Error creating uploads directory:', err);
    }
    
    // Generate unique name for the file to prevent conflicts
    const fileExtension = path.extname(file.name);
    const fileNameWithoutExt = path.basename(file.name, fileExtension).replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${fileNameWithoutExt}-${Date.now()}${fileExtension}`;
    
    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, buffer);
    
    const fileUrl = `/uploads/${filename}`;
    
    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
