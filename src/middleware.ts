import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const notAuthorizedUrls = ['/', '/login', '/register']

export function middleware(request: NextRequest) {
    console.log(cookies().get("AUTH_TOKEN"))
    if (notAuthorizedUrls.includes(request.nextUrl.pathname)) {
        if (cookies().get("AUTH_TOKEN")) {
            return NextResponse.redirect(new URL('/i/home', request.url))
        }
        return NextResponse.next();
    }

    if (request.nextUrl.pathname.startsWith("/i/")) {
        if (!cookies().get("AUTH_TOKEN")) {
            return NextResponse.redirect(new URL('/', request.url))
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!abc|api|_next/static|images|favicon.ico).*)']
}