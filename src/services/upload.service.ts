'use client';

import { API_URL, api, catchApiError } from "@/api";
import { IResponse } from "@/types/api.types";
import { RcFile } from "antd/es/upload";
import { AxiosRequestConfig } from "axios";

export enum UploadType {
    BANNER = "banners",
    AVATAR = "avatars",
    EDUCATION_MATERIAL_RESOURCE = "education_material_resources",
    EDUCATION_MATERIAL = "education_materials",
    EXAM_RESOURCE = "exam_resources",
    HOMEWORK_RESOURCE = "homework_resources",
    HOMEWORK = "homework",
}

export const UploadService = {
    async upload(folder: UploadType, file: RcFile): Promise<IResponse> {
        try {
            const formData = new FormData();
            formData.append("file", file);
            console.log(file)
            const config: AxiosRequestConfig<FormData> = {
                onUploadProgress: function(progressEvent) {
                    // @ts-ignore
                    var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    console.log(percentCompleted + "%")
                },
                params: {
                    folder
                },
                "headers": {
					"content-type": 'multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s'
				}
            }

            let response = await api.post("/storage/upload", formData, config);

            return {
                success: true,
                data: response.data.path
            }
        } catch (e) {
            return catchApiError(e);
        }
    },

    getImageURL: (type: UploadType, uid: string): string => {
        return `${API_URL}/storage/download?path=${type}/${uid}`;
    }
}