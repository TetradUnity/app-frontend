'use client';

import {useParams, useRouter} from "next/navigation";
import {useSubjectStore} from "@/stores/subjectStore";
import {useShallow} from "zustand/react/shallow";

export default function SubjectPage() {
    const {replace} = useRouter();
    const { slug } = useParams();

    replace("/subject/" + slug + "/assignments");

    return null;
}