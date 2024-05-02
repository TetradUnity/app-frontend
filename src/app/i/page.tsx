'use client'

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/i/home");
    });

    return (
        <></>
    )
}