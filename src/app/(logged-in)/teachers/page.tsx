'use client'
import UsersPage from "@/components/usersPage";
import {useEffect} from "react";

export default function Teachers() {
    useEffect(() => {
        document.title = `Вчителі / Пошук`
    }, [])
    return <UsersPage title="Вчителі" type='TEACHER' />;
}
