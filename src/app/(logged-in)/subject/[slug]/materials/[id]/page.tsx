'use client';

import Foreground from "@/components/Foreground";
import BackButton from "@/components/subject/BackButton";
import { Spin } from "antd";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react"

export default function MaterialPage() {
    const { id } = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [isNotFound, setNotFound] = useState(false);

    useEffect(() => {
        let subjectId = parseInt(id as string);

        if (!subjectId || subjectId < 0) {
            setNotFound(true);
            return;
        }
    }, []);
    
    if (isNotFound) {
        notFound();
    }

    if (isLoading) {
        return (
            <Foreground>
                <BackButton />
                <Spin style={{display: "block", margin: "auto"}} spinning />
            </Foreground>
        )
    }

    return (
        <h1>Material</h1>
    )
}