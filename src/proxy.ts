import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'portfolio_admin_session';

async function getPasswordHash(password: string) {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protect all /admin routes except /admin/login
  const isAdminPage = pathname.startsWith('/admin') && pathname !== '/admin/login';
  
  // Protect state-mutating API routes (POST, PUT, DELETE) while keeping public GET routes accessible
  const isMutatingApi = pathname.startsWith('/api/') && 
                        !pathname.startsWith('/api/auth/') &&
                        ['POST', 'PUT', 'DELETE'].includes(request.method);

  if (isAdminPage || isMutatingApi) {
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const expectedHash = await getPasswordHash(password);
    
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    
    if (sessionCookie !== expectedHash) {
      if (isAdminPage) {
        // Redirect to login page
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
      } else {
        // Return 401 Unauthorized for API requests
        return new NextResponse(
          JSON.stringify({ success: false, error: 'Unauthorized' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }
  
  return NextResponse.next();
}

// Config to specify matching routes for speed optimization
export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
