'use client'

import { deleteCookie, getCookie, setCookie } from "@/utils/CookieUtils";

const AUTH_COOKIE_NAME = "AUTH_TOKEN";
const AUTH_COOKIE_EXPIRE = 365;

export const AuthTokensService = {
    getAuthToken(): string {
        return getCookie(AUTH_COOKIE_NAME);
    },

    setAuthToken(token: string): void {
        setCookie(AUTH_COOKIE_NAME, token, AUTH_COOKIE_EXPIRE);
    },
    
    deleteAuthToken() {
        deleteCookie(AUTH_COOKIE_NAME);
    }
};