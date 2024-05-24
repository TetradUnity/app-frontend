'use client'
import UsersPage from "@/components/usersPage";
import {tempTeachers} from "@/temporary/data";
import {useEffect} from "react";

export default function Teachers() {
    useEffect(() => {
        document.title = `Вчителі / Пошук`
    }, [])
    return <UsersPage title="Вчителі" users={tempTeachers} />;
}
