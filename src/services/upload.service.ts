'use client';

import { API_URL, api, catchApiError } from "@/api";
import { useUploadStore } from "@/stores/uploadStore";
import { IResponse } from "@/types/api.types";
import translateRequestError from "@/utils/ErrorUtils";
import { RcFile } from "antd/es/upload";
import { AxiosRequestConfig } from "axios";

export enum UploadType {
    BANNER = "banners",
    AVATAR = "avatars",
    EDUCATION_MATERIAL_RESOURCE = "education_material_resources",
    EDUCATION_MATERIAL = "education_materials",
    EXAM_RESOURCE = "exam_resources",
    HOMEWORK = "homework",
    CERTIFICATES = "certificates"
}

export const UploadService = {
    async upload(folder: UploadType, file: RcFile): Promise<IResponse> {
        const uploadProgress = useUploadStore.getState();

        try {
            uploadProgress.setVisible(true);

            const formData = new FormData();
            formData.append("file", file);
            const config: AxiosRequestConfig<FormData> = {
                onUploadProgress: function(progressEvent) {
                    // @ts-ignore
                    var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    uploadProgress.setProgress(percentCompleted);
                },
                params: {
                    folder
                },
                "headers": {
					"content-type": 'multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s'
				}
            }

            let response = await api.post("/storage/upload", formData, config);

            setTimeout(() => {
                uploadProgress.setVisible(false);
            }, 2100);

            return {
                success: true,
                data: response.data.path
            }
        } catch (e) {
            const resp = catchApiError(e);

            uploadProgress.setError(translateRequestError(resp.error_code));
            setTimeout(() => {
                uploadProgress.setVisible(false);
                uploadProgress.setError('');
                uploadProgress.setProgress(0);
            }, 2500);

            return resp;
        }
    },

    getImageURL: (type: UploadType, uid: string): string => {
        return `${API_URL}/storage/download?path=${type}/${uid}`;
    },
    getImageURLByPath: (path: string): string => {
        return `${API_URL}/storage/download?path=${path}`;
    }
}