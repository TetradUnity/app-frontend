'use client'

import StudentHomePage from "@/components/i/students/StudentHomePage";
import TeacherHomePage from "@/components/i/teacher/TeacherHomePage";
import { useAccountStore } from "@/stores/accountStore"

export default function HomePage() {
    const role = useAccountStore(state => state.role);

    return role == "student" ? <StudentHomePage /> : <TeacherHomePage />;
}