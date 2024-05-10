'use client'

import { AuthTokensService } from "@/services/auth-token.service";
import { IResponse } from "@/types/api.types";
import axios from "axios";

const API_URL = process.env.NODE_ENV == "production" ? process.env.NEXT_PUBLIC_API_URL : process.env.NEXT_PUBLIC_DEV_API_URL;

export const api = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-type": "application/json",
    },
});

api.interceptors.request.use(function (config) {
    const token = AuthTokensService.getAuthToken();
    if (token) {
        config.headers.setAuthorization(token);
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
});

/*
print cookie:
if (typeof window !== null) {
            console.log(AuthTokensService.getAuthToken())
        }
*/

const interceptor = api.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    let refreshToken: string = AuthTokensService.getRefreshToken();
    if (error.response.status !== 401 || (!refreshToken || refreshToken.length == 0)) {
        return Promise.reject(error);
    }

    api.interceptors.response.eject(interceptor);

    return api.post("/authorization/refresh-authorized", {
        refresh_token: refreshToken
    })
    .then(response => {
        AuthTokensService.setAuthToken(response.data.accessToken);
        AuthTokensService.setRefreshToken(response.data.refreshToken);

        return axios(error.response.config);
    })
    .catch(err2 => {
        AuthTokensService.deleteAuthToken();
        AuthTokensService.deleteRefreshToken();

        const sp = new URLSearchParams({
            err: "Вам потрібно перезайти в акаунт."
        });
        window.location.href = "/?" + sp.toString();

        return Promise.reject(err2);
    })
});

export function catchApiError(error: any): IResponse {
    if (process.env.NODE_ENV == "development") {
        console.log(error);
    }

    if (axios.isAxiosError(error)) {
        return {
            success: false,
            error_code: (error.response?.data?.error) || "unknown_error"
        }
    }
    
    return {
        success: false,
        error_code: "unknown_error"
    }
}