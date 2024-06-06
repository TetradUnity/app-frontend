'use client'
import {useQueryProfileStore} from "@/stores/queryProfileStore";
import {useEffect} from "react";

export default function Achievements() {
    const profileQuery = useQueryProfileStore();
    
    useEffect(() => {
        document.title = `Досягнення / ${profileQuery.first_name} ${profileQuery.last_name}`
    }, [])

    return (
        <h1>Achievements</h1>
    );
}