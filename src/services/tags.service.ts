'use client'

import { api, catchApiError } from "@/api";
import { ITResponse } from "@/types/api.types";

export const TagsService = {
    async search(query: string): Promise<ITResponse<string[]>> {
        try {
            const response = await api.get("/tag/find-tags-prefix", {
                params: {
                    prefix: query
                }
            });

            return {
                success: true,
                data: response.data.tags
            }
        } catch (e) {
            return catchApiError(e);
        }
    }
};