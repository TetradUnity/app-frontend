'use client'

import { deleteCookie, getCookie, setCookie } from "@/utils/CookieUtils";

const AUTH_COOKIE_NAME = "AUTH_TOKEN";
const REFRESH_COOKIE_NAME = "REFRESH_TOKEN";

const COOKIE_EXPIRE = 365;

export const AuthTokensService = {
    getAuthToken(): string {
        return getCookie(AUTH_COOKIE_NAME);
    },

    setAuthToken(token: string): void {
        setCookie(AUTH_COOKIE_NAME, token, COOKIE_EXPIRE);
    },
    
    deleteAuthToken() {
        deleteCookie(AUTH_COOKIE_NAME);
    },


    getRefreshToken(): string {
        return getCookie(REFRESH_COOKIE_NAME);
    },

    setRefreshToken(token: string): void {
        setCookie(REFRESH_COOKIE_NAME, token, COOKIE_EXPIRE);
    },
    
    deleteRefreshToken() {
        deleteCookie(REFRESH_COOKIE_NAME);
    },
};