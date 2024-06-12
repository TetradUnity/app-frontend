import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const notAuthorizedUrls = [
    '/', '/login'
];
const authorizedUrls = [
    '/home',
    '/profile',
    '/subject',
    '/students',
    '/teachers'
];
const availableForBoth = [
    '/subjects', '/profile'
]

const checkUrl = (pathname: string, urls: string[]) => {
    for (let i = 0; i < urls.length; i++) {
        if (pathname.startsWith(urls[0])) {
            return true;
        }
    }

    return false;
}

export function middleware(request: NextRequest) {
    const isAuthorized = cookies().get("AUTH_TOKEN");
    const url = request.nextUrl.pathname;

    if (checkUrl(url, availableForBoth)) {
        return NextResponse.next();
    }

    if (checkUrl(url, authorizedUrls)) {
        if (!isAuthorized) {
            return NextResponse.redirect(new URL('/', request.url))
        }
        return NextResponse.next();
    }

    if (checkUrl(url, notAuthorizedUrls)) {
        if (isAuthorized) {
            return NextResponse.redirect(new URL('/home', request.url))
        }
        return NextResponse.next();
    }
}

export const config = {
    matcher: ['/((?!abc|api|_next/static|images|favicon.ico).*)']
}