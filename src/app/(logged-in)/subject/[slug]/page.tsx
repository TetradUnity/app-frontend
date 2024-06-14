'use client';

import {useParams, useRouter} from "next/navigation";

export default function SubjectPage() {
    const {replace} = useRouter();
    const { slug } = useParams();

    replace("/subject/" + slug + "/assignments");

    return null;
}