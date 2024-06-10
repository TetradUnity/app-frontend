'use client'

import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function Settings() {
    const router = useRouter();

    useEffect(() => {
        router.push("/profile/settings/about")
    }, [])

    return null;
}