'use client';

import SubjectCalendar from "@/components/SubjectCalendar";
import { useProfileStore } from "@/stores/profileStore";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";

export default function SubjectCalendarPage() {
    const role = useProfileStore(useShallow(state => state.role));
    const { replace } = useRouter();

    if (role != "STUDENT") {
        replace("/");
        return null;
    }

    return (
        <SubjectCalendar />
    )
}