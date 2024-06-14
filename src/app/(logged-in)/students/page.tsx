'use client'
import UsersPage from "@/components/usersPage";
// import {tempStudents} from "@/temporary/data";
import {useEffect} from "react";

export default function Students() {
    useEffect(() => {
        document.title = `Студенти / Пошук`
    }, [])
    // return <UsersPage title="Студенти" users={tempStudents} />;
    return null;
}
