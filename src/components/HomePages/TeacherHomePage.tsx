'use client'

import styles from "@/components/HomePages/styles.module.css";
import {tempSubjects} from "@/temporary/data";
import SubjectCard from "@/components/cards/SubjectCard";
import Foreground from "@/components/Foreground";
import { SubjectNamespace } from "@/types/api.types";
import { Divider, Empty } from "antd";

type mockType = {
    active: SubjectNamespace.ISubjectShort[],
    other: SubjectNamespace.ISubjectShort[],
}
const subjects: mockType = {
    active: [
        {
            id: 0,
            type: "ACTIVE_SUBJECT",
            title: "Tyzologia",
            banner: "https://realkm.com/wp-content/uploads/2020/02/teacher-cartoon-board-chalkboard-class-person-1449505-pxhere.com_.jpg",
            info: 0
        }
    ],
    other: [
        {
            id: 0,
            type: "ANNOUNCED_SUBJECT",
            title: "Tyzologia",
            banner: "https://realkm.com/wp-content/uploads/2020/02/teacher-cartoon-board-chalkboard-class-person-1449505-pxhere.com_.jpg",
            info: 0
        },
        {
            id: 0,
            type: "PREPARING_SUBJECT",
            title: "Tyzologia",
            banner: "https://realkm.com/wp-content/uploads/2020/02/teacher-cartoon-board-chalkboard-class-person-1449505-pxhere.com_.jpg",
            info: 0
        },
        {
            id: 0,
            type: "READY_SUBJECT",
            title: "Tyzologia",
            banner: "https://realkm.com/wp-content/uploads/2020/02/teacher-cartoon-board-chalkboard-class-person-1449505-pxhere.com_.jpg",
            info: 0
        }
    ]
}

export default function TeacherHomePage() {
    return (
        <>
            <Foreground>
                <h1 style={{marginBottom: 10}}>Активні предмети:</h1>
                <div className={styles.subject_container}>
                    {subjects.active.length > 0
                        ? subjects.active.map(subject => 
                            <SubjectCard subject={subject} />
                        )
                        : <Empty description="Порожньо." />
                    }
                </div>

                {subjects.other.length > 0 &&
                    <>
                        <Divider />

                        <h1 style={{marginBottom: 10}}>Інші:</h1>
                        <div className={styles.subject_container}>
                            {subjects.other.map(subject => 
                                <SubjectCard subject={subject} />
                            )}
                        </div>
                    </>
                }
            </Foreground>
        </>
    )
}