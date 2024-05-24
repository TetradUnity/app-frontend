'use client'

import { useRouter } from "next/navigation"
import { useEffect } from "react";

export default function ChiefTeacherHomePage() {
    const {replace} = useRouter();

    useEffect(() => {
        replace("/subjects")
    }, []);

    return null;
}