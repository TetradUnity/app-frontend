'use client'

import { api, catchApiError } from "@/api";
import { IResponse } from "@/types/api.types";
import { AuthTokensService } from "./auth-token.service";

export const AuthService = {
    async login(email: string, password: string): Promise<IResponse> {
        try {
            const response = await api.post("/authorization/login", {
                email, password
            });

            AuthTokensService.setAuthToken(response.data.accessToken);
            AuthTokensService.setRefreshToken(response.data.refreshToken);

            return {
                success: true
            }
        } catch (error) {
            return catchApiError(error);
        }
    },

    async createUser(email: string, first_name: string, last_name: string, password: string): Promise<IResponse> {
        try {
            const response = await api.post("/authorization/create-user", {
                email, first_name, last_name, password
            });

            return {
                success: true
            }
        } catch (error) {
            return catchApiError(error);
        }
    },

    async isValidToken(): Promise<IResponse> {
        try {
            await api.get("/user/check-authorized");

            return {
                success: true
            }
        } catch (error) {
            return catchApiError(error);
        }
    },

    async forgotPassword(email: string): Promise<IResponse> {
        try {
            await api.post("/authorization/forgot-password", {}, {
                params: { email }
            });

            return {
                success: true
            }
        } catch (error) {
            return catchApiError(error);
        }
    },

    async recoveryPassword(recoveryUID: string, newPassword: string): Promise<IResponse> {
        try {
            await api.post("/authorization/recovery-password/" + recoveryUID, {
                model: newPassword
            });

            return {
                success: true
            }
        } catch (error) {
            return catchApiError(error);
        }
    },

    // chief teacher
    async register(email: string, first_name: string, last_name: string, password: string, role: string): Promise<IResponse> {
        try {
            await api.post("/authorization/create-admin", {
                email, first_name, last_name, password, role
            });

            return {
                success: true
            }
        } catch (error) {
            return catchApiError(error);
        }
    }
};