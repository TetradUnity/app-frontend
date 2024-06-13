'use client'

import { api, catchApiError } from "@/api";
import { IResponse, ITResponse, IUser } from "@/types/api.types";

export type EditProfileProps = {email?: string, password?: string, first_name?: string, last_name?: string, oldPassword?: string, avatar?: string};

export const UserService = {
    async getProfile(userId?: number): Promise<ITResponse<IUser>> {
        try {
            const response = await api.get("/user/get", {
                params: {
                    id: userId
                }
            });

            return {
                success: true,
                data: response.data.user
            }
        } catch (e) {
            return catchApiError(e);
        }
    },

    async editProfile({email, password, first_name, last_name, oldPassword, avatar}: EditProfileProps): Promise<IResponse> {
        try {
            const response = await api.put("/user/edit", {
                email,
                password,
                first_name,
                last_name,
                oldPassword,
                avatar
            });

            console.log(response)

            return {
                success: true,
                data: response.data.user
            }
        } catch (e) {
            return catchApiError(e);
        }
    },

    async findUsers({email, first_name, last_name, role, limit, page}: {email?: string, first_name?: string, last_name?: string, role: "TEACHER" | "STUDENT", limit: number, page: number}): Promise<ITResponse<IUser[]>> {
        try {
            const response = await api.get("/user/find-users", {
                params: {
                    email,
                    first_name,
                    last_name,
                    role,
                    limit,
                    page
                }
            });

            return {
                success: true,
                data: response.data.users
            }
        } catch (e) {
            return catchApiError(e);
        }
    }
};