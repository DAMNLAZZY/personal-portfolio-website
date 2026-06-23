import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    // Resolve dynamic uploads directory path
    const uploadsDir = process.env.DATA_DIR 
      ? path.resolve(process.env.DATA_DIR, 'uploads')
      : path.join(/*turbopackIgnore: true*/ process.cwd(), 'uploads');
      
    let filePath = path.join(uploadsDir, filename);
    
    // Check in persistent uploads folder
    if (!existsSync(filePath)) {
      // Fallback to public/uploads directory for committed assets
      filePath = path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', 'uploads', filename);
    }
    
    if (!existsSync(filePath)) {
      return new NextResponse('File Not Found', { status: 404 });
    }
    
    const fileBuffer = await fs.readFile(filePath);
    
    // Determine content type
    let contentType = 'application/octet-stream';
    const ext = path.extname(filename).toLowerCase();
    if (ext === '.pdf') contentType = 'application/pdf';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.doc') contentType = 'application/msword';
    else if (ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
