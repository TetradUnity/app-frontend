'use client'

import Foreground from "@/components/Foreground";
import ChiefTeacherHomePage from "@/components/HomePages/ChiefTeacherHomePage";
import StudentHomePage from "@/components/HomePages/StudentHomePage";
import TeacherHomePage from "@/components/HomePages/TeacherHomePage";
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
        <Foreground>
            {content}
        </Foreground>
    );
}