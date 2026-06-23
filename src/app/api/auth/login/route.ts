import { NextResponse } from 'next/server';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'portfolio_admin_session';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const configuredPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (password !== configuredPassword) {
      return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
    }
    
    // Compute SHA-256 hash of password to use as session token
    const hash = crypto.createHash('sha256').update(configuredPassword).digest('hex');
    
    const response = NextResponse.json({ success: true });
    
    // Set Secure HTTP-only cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: hash,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
