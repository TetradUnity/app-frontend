'use client'

import {useEffect} from "react";

export default function page() {
    useEffect(() => {
        document.title = "Відновлення паролю";
    }, []);
    return (
        <div>
            <h1>TODO FORGOT PASSWORD PAGE</h1>
        </div>
    )
}