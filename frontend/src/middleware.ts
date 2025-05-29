import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const pathname = request.nextUrl.pathname;

  const isAuthPage = pathname === '/auth/login' || pathname === '/auth/registration';

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/login', '/auth/registration', '/', '/addNote', '/history', '/analytics', '/addCategory', '/profile'],
};
