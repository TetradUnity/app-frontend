'use client'

import ChiefTeacherHomePage from "@/components/HomePages/ChiefTeacherHomePage";
import StudentHomePage from "@/components/HomePages/StudentHomePage";
import TeacherHomePage from "@/components/HomePages/TeacherHomePage";
import {useProfileStore} from "@/stores/profileStore"
import {useShallow} from "zustand/react/shallow";
import {useEffect} from "react";

export default function HomePage() {
    const role = useProfileStore(useShallow(state => state.role));

    useEffect(() => {
        document.title = `Головна сторінка`
    }, [])

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
        <>
            {content}
        </>
    );
}