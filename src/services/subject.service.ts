'use client'

import { api, catchApiError } from "@/api";
import {
    IResponse,
    IStudentShortInfo,
    ITArrResponse,
    ITResponse,
    Responses,
    SubjectNamespace
} from "@/types/api.types";
import { isAxiosError } from "axios";

export const SubjectService = {
    async getSubjects(): Promise<Responses.GetSubjectsResponse> {
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

    async getSubject(subjectId: number): Promise<Responses.GetSubjectResponse> {
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

    async getStudents(subjectId: number, page: number): Promise<Responses.GetStudentsResponse> {
        try {
            const response = await api.get("/subject/get-students", {
                params: { subject_id: subjectId, page }
            });

            return {
                success: true,
                data: response.data.students,
                count: response.data.count
            }
        } catch (error) {
            return catchApiError(error);
        }
    },

    async getAllStudents(subjectId: number): Promise<Responses.GetAllStudentsResponse> {
        try {
            const response = await api.get("/subject/get-all-students", {
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

    async finishSubject(subject_id: number): Promise<Responses.FinishSubjectResponse> {
        try {
            const response = await api.delete("/subject/finish-subject", {
               params: { subject_id }
            });

           return {
               success: true
           }
       } catch (e) {
            if (isAxiosError(e) && e.response) {
                let body = e.response.data;

                return {
                    success: false,
                    error_code: body.error,
                    no_rate_task_id: body.no_rate_task_id,
                    no_rate_task_title: body.no_rate_task_title,
                    no_ended_task_id: body.no_ended_task_id,
                    no_ended_task_title: body.no_ended_task_title
                };
            }
           return catchApiError(e);
       }
    }
};