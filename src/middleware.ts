import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const notAuthorizedUrls = ['/', '/login', '/register'];
const authorizedUrls = ['/home', '/profile'];

export function middleware(request: NextRequest) {
    if (notAuthorizedUrls.includes(request.nextUrl.pathname)) {
        if (cookies().get("AUTH_TOKEN")) {
            return NextResponse.redirect(new URL('/home', request.url))
        }
        return NextResponse.next();
    }
    
    if (authorizedUrls.includes(request.nextUrl.pathname)) {
        if (!cookies().get("AUTH_TOKEN")) {
            return NextResponse.redirect(new URL('/', request.url))
        }
        return NextResponse.next();
    }
}

export const config = {
    matcher: ['/((?!abc|api|_next/static|images|favicon.ico).*)']
}