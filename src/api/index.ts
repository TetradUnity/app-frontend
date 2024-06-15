'use client'

import { AuthTokensService } from "@/services/auth-token.service";
import { IResponse } from "@/types/api.types";
import axios from "axios";

export const API_URL = process.env.NODE_ENV == "production" ? process.env.NEXT_PUBLIC_API_URL : process.env.NEXT_PUBLIC_DEV_API_URL;

export const api = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-type": "application/json",
    },
});

api.interceptors.request.use(function (config) {
    const token = AuthTokensService.getAuthToken();
    if (token && config.url != "/authorization/refresh-authorized") {
        config.headers.setAuthorization(token);
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
});

const interceptor = api.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    let refreshToken: string = AuthTokensService.getRefreshToken();
    if (error?.response?.status !== 401 || (!refreshToken)) {
        return Promise.reject(error);
    }

    api.interceptors.response.eject(interceptor);

    return api.post("/authorization/refresh-authorized", {}, {
        headers: {
            Authorization: refreshToken
        }
    })
    .then(response => {
        if (response.data) {
            AuthTokensService.setAuthToken(response.data.accessToken);
            AuthTokensService.setRefreshToken(response.data.refreshToken);
            window.location.href = window.location.href;
        }

        return axios(error.response.config);
    }).catch(err2 => {
        if (axios.isAxiosError(err2) && err2.response?.status === 401 && err2.config?.url == "/authorization/refresh-authorized") {
            AuthTokensService.deleteAuthToken();
            AuthTokensService.deleteRefreshToken();
    
            const sp = new URLSearchParams({
                err: "Вам потрібно перезайти в акаунт."
            });
            window.location.href = "/?" + sp.toString();
        }
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
        error_code: "network_error"
    }
}