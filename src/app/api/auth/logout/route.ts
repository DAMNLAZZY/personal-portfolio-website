import { NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'portfolio_admin_session';

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    
    // Clear session cookie by deleting it
    response.cookies.delete({
      name: SESSION_COOKIE_NAME,
      path: '/',
    });
    
    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
