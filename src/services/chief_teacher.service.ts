'use client'

import { api, catchApiError } from "@/api";
import { CreateSubjectParams, IResponse } from "@/types/api.types";

export const ChiefTeacherService = {
    // auth
    async createUser(email: string, password: string, firstName: string, lastName: string, role: "teacher" | "student"): Promise<IResponse> {
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
    async createSubject({start, exam_end, title, short_description, description, duration, timetable, teacherEmail, tags, exam} : CreateSubjectParams): Promise<IResponse> {
        try {
            const response = await api.post("/subject/create", {
                start, exam_end,
                title: title, description, short_description,
                duration: duration, timetable: timetable, teacher_email: teacherEmail,
                tags: tags, exam: exam
            });
            
            return {
                success: true
            }
        } catch (error) {
            return catchApiError(error);
        }
    }
};