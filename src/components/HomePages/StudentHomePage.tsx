'use client'
import {List} from "antd";
import {tempSubjects} from "@/temporary/data";
import SubjectCard from "@/components/cards/SubjectCard";
import styles from "./styles.module.css";
import Foreground from "@/components/Foreground";

export default function StudentHomePage() {
    const lastGrades = [{
        subject: "Math",
        task: "logarithms test",
        grade: 5,
        when: Date.now(),
        teacherName: "Maxim Ivanov"
    }, {
        subject: "Physics",
        task: "homework",
        grade: 4,
        when: Date.UTC(2021, 5, 1),
        teacherName: "Ivan Petrov"
    }, {
        subject: "Chemistry",
        task: "lab work",
        grade: 3,
        when: Date.UTC(2021, 5, 3),
        teacherName: "Vasyl Ivanov"
    }, {
        subject: "Biology",
        task: "test",
        grade: 4,
        when: Date.UTC(2021, 5, 5),
        teacherName: "Ivan Petrov"
    }, {
        subject: "History",
        task: "essay",
        grade: 5,
        when: Date.UTC(2021, 5, 7),
        teacherName: "Maxim Ivanov"
    }];

    return (
        <>
            <Foreground>
                <h1>Предмети</h1>
                <div className={styles.SubjectsContainer}>
                    {tempSubjects.map(item => (
                        <div key={item.id} className={styles.Subject}>
                            <SubjectCard subject={item}/>
                        </div>
                    ))}
                </div>
            </Foreground>
            <Foreground>
                <h1>Останні оцінки (TODO)</h1>
                <List
                    dataSource={lastGrades.slice(0, 5)}
                    size="small"
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                title={`Ви отримали оцінку ${item.grade} з предмету ${item.subject}, ${item.task}`}
                                description={generateDescription(item)}
                            />
                        </List.Item>
                    )}

                />
            </Foreground>
        </>
    );
}

function generateDescription(item: { subject?: string; task?: string; grade?: number; when: any; teacherName: any; }) {
    const timeDifference = Date.now() - item.when;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    const secondsDifference = Math.floor(timeDifference / 1000);

    let timeAgo;
    if (daysDifference < 1) {
        timeAgo = minutesDifference < 1 ? `${secondsDifference} seconds ago` : `${minutesDifference} minutes ago`;
    } else {
        timeAgo = `${daysDifference} days ago`;
    }

    return `${item.teacherName} ${new Date(item.when).toLocaleDateString()} (${timeAgo})`;
}