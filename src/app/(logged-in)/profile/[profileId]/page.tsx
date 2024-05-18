'use client'

import {useRouter} from "next/navigation";

export default function AccountPage() {
    const {replace} = useRouter();

    replace(location.pathname + "/subjects");
    return null;
}