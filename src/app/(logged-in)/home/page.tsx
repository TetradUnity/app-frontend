'use client'

import ChiefTeacherHomePage from "@/components/chief-teacher/ChiefTeacherHomePage";
import StudentHomePage from "@/components/students/StudentHomePage";
import TeacherHomePage from "@/components/teacher/TeacherHomePage";
import {useProfileStore} from "@/stores/profileStore"
import {useShallow} from "zustand/react/shallow";

export default function HomePage() {
    const role = useProfileStore(useShallow(state => state.role));

    let content;
    switch (role) {
        case "teacher":
            content = <TeacherHomePage/>
            break;
        case "student":
            content = <StudentHomePage/>
            break;
        case "chief_teacher":
            content = <ChiefTeacherHomePage/>
            break;
    }

    return (
        <div style={{
            margin: "auto",
            padding: "12px 16px",
            background: 'var(--foreground)',
            borderRadius: 10,
            boxShadow: "10px 10px 78px -19px rgba(20,20,20,0.9)",
            display: "block",
        }}>{content}
        </div>);
}