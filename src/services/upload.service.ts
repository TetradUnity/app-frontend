'use client';

import { API_URL } from "@/api";

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
    upload() {
        
    },

    getImageURL: (type: UploadType, uid: string): string => {
        return `${API_URL}/storage/download?path=${type}/${uid}`;
    }
}