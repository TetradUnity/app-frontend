'use client'

import { api, catchApiError } from "@/api";
import { Responses } from "@/types/api.types";

export const TagsService = {
    async search(query: string): Promise<Responses.TagsSearchResponse> {
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