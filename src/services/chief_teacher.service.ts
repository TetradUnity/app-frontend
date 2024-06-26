'use client'

import { api, catchApiError } from "@/api";
import { CreateSubjectParams, IResponse, ISearchUserResult, ITArrResponse, Responses } from "@/types/api.types";

export const ChiefTeacherService = {
    // users
    async findTeacherByEmail(emailFind: string, page?: number, limit?: number): Promise<Responses.FindTeacherByEmailResponse> {
        try {
            const response = await api.get("/user/find-users", {
                params: {
                    email: emailFind,
                    role: "TEACHER",
                    page, limit
                }
            });

            return {
                success: true,
                data: response.data.users
            }
        } catch (error) {
            return catchApiError(error);
        }
    },

    // auth
    async createUser(firstName: string, lastName: string, email: string, password: string, role: "TEACHER" | "STUDENT"): Promise<IResponse> {
        try {
            const response = await api.post("/authorization/create-user", {
                email, password,
                first_name: firstName, last_name: lastName,
                role: role
            });

            return {
                success: true
            }
        } catch (error) {
            return catchApiError(error);
        }
    },

    // subject
    async createSubject({start, exam_end, title, short_description, description, duration, timetable, teacherEmail, tags, exam, banner} : CreateSubjectParams): Promise<Responses.CreateSubjectResponse> {
        try {
            const response = await api.post("/subject/create", {
                time_start: start, time_exam_end: exam_end,
                title: title, description, short_description,
                duration: duration, timetable: timetable, teacher_email: teacherEmail,
                tags: tags, exam: exam, banner: banner
            });
            
            return {
                success: true,
                subject_id: response.data.subject_id
            }
        } catch (error) {
            return catchApiError(error);
        }
    }
};