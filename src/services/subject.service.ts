'use client'

import { api, catchApiError } from "@/api";
import {
    IResponse,
    IStudentShortInfo,
    ITArrResponse,
    ITResponse,
    SubjectNamespace
} from "@/types/api.types";

export const SubjectService = {
    async getSubjects(): Promise<ITArrResponse<SubjectNamespace.ISubject>> {
        try {
            const response = await api.get("/subject/get-subjects");

            return {
                success: true,
                data: response.data.subjects
            }
        } catch (error) {
            return catchApiError(error);
        }
    },

    async getSubject(subjectId: number): Promise<ITResponse<SubjectNamespace.ISubject>> {
        try {
            const response = await api.get("/subject/get", {
                params: { subjectId }
            });

            return {
                success: true,
                data: response.data.subject
            }
        } catch (error) {
            return catchApiError(error);
        }
    },

    async getStudents(subjectId: number): Promise<ITArrResponse<IStudentShortInfo>> {
        try {
            const response = await api.get("/subject/get-students", {
                params: { subject_id: subjectId }
            });

            return {
                success: true,
                data: response.data.students
            }
        } catch (error) {
            return catchApiError(error);
        }
    },

    async finishSubject(subject_id: number): Promise<IResponse> {
        try {
            await api.delete("/subject/finish-subject", {
               params: { subject_id }
            });

           return {
               success: true
           }
       } catch (e) {
           return catchApiError(e);
       }
    }
};