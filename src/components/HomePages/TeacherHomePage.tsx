'use client'

import styles from "@/components/HomePages/styles.module.css";
import {tempSubjects} from "@/temporary/data";
import SubjectCard from "@/components/cards/SubjectCard";
import Foreground from "@/components/Foreground";

export default function TeacherHomePage() {
    return (
        <>
            <Foreground>
                <h1>Предмети, які ви викладаєте</h1>
                <div className={styles.SubjectsContainer}>
                    {tempSubjects.map(item => (
                        <div key={item.id} className={styles.Subject}>
                            {/* <SubjectCard subject={item} filters={{}} /> */}
                        </div>
                    ))}
                </div>
            </Foreground>
        </>
    )
}