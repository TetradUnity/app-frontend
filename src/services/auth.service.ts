'use client'

import { API_URL, catchApiError } from "@/api";
import { IResponse } from "@/types/api.types";
import axios from "axios";

export const AuthService = {
    async login(email: string, password: string): Promise<IResponse> {
        try {
            const response = await axios.post(API_URL + "/authorization/login", {
                email, password
            });

            // response.data.accessToken
            // response.data.refreshToken

            return {
                success: true
            }
        } catch (error) {
            return catchApiError(error);
        }
    },

    async createUser(email: string, first_name: string, last_name: string, password: string): Promise<IResponse> {
        try {
            const response = await axios.post(API_URL + "/authorization/create-user", {
                email, first_name, last_name, password
            });

            return {
                success: true
            }
        } catch (error) {
            return catchApiError(error);
        }
    },


    async refreshToken(): Promise<IResponse> {
        try {
            const response = await axios.post(API_URL + "/authorization/refresh-authorized");

            return {
                success: true
            }
        } catch (error) {
            return catchApiError(error);
        }
    }
};