'use client';

import { useRouter } from "next/navigation";

export default function SubjectPage() {
    const {replace} = useRouter();

    replace(location.pathname + "/assigments");
    return null;
}