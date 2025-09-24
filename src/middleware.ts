import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const TOKEN_NAME = process.env.NEXT_PUBLIC_TOKEN_NAME || 'token';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get(TOKEN_NAME)?.value;
  const isLoginPage = pathname === '/app/login';

  if (!token && !isLoginPage) {
    const loginUrl = new URL('/app/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/app/:path*',
};
