'use client';

import { useProfileStore } from "@/stores/profileStore"
import { useShallow } from "zustand/react/shallow";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Foreground from "@/components/Foreground";

import { SubjectNamespace } from "@/types/api.types";
import { Divider, Empty, Spin } from "antd";

import styles from "@/components/HomePages/styles.module.css";
import SubjectCard from "@/components/cards/SubjectCard";
import { SubjectService } from "@/services/subject.service";
import translateRequestError from "@/utils/ErrorUtils";

export default function HomePage() {
    const role = useProfileStore(useShallow(state => state.role));
    const {replace} = useRouter();

    const [activeSubjects, setActiveSubjects] = useState<SubjectNamespace.ISubjectShort[]>([]);
    const [otherSubjects, setOtherSubjects] = useState<SubjectNamespace.ISubjectShort[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        document.title = `Головна сторінка`;
        
        SubjectService.getSubjects().then(response => {
            setIsLoading(false);

            if (!response.success) {
                setError(response.error_code as string)
                return;
            }


            const subjects = response.data!;

            setActiveSubjects(subjects.filter(subject => subject.type == "ACTIVE_SUBJECT"));
            setOtherSubjects(subjects.filter(subject => subject.type != "ACTIVE_SUBJECT"));
        })
    }, []);

    if (role == "CHIEF_TEACHER") {
        replace("/subjects");
        return;
    }

    if (isLoading) {
        return (
            <Foreground>
                <Spin spinning />
            </Foreground>
        )
    }

    if (error) {
        return (
            <Foreground>
                <p style={{textAlign: "center", fontSize: 30}}>Трапилась помилка: {translateRequestError(error)}</p>
            </Foreground>
        )
    }

    return (
        <>
            <Foreground>
            <h1 style={{marginBottom: 10}}>Активні предмети:</h1>
            {activeSubjects.length > 0
                ? <div className={styles.subject_container}>
                        {activeSubjects.map(subject => 
                            <SubjectCard key={subject.id} subject={subject} />
                        )}
                    </div>
                : <Empty description="Порожньо." />
            }
            </Foreground>

            {otherSubjects.length > 0 &&
                <Foreground>
                    <h1 style={{marginBottom: 10}}>Інші:</h1>
                    <div className={styles.subject_container}>
                        {otherSubjects.map(subject => 
                            <SubjectCard key={subject.id} subject={subject} />
                        )}
                    </div>
                </Foreground>
            }
        </>
    );
}