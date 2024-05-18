import {Divider, Flex, Image} from "antd";
import styles from "./subject.module.css";
import Link from "next/link";
import {tempTeachers} from "@/temporary/data";

interface SubjectCardProps {
    subject: {
        id: number,
        title: string,
        teacher_id: number,
        description: string,
        is_active: boolean,
        created_at: string,
        exam: any,
        exam_end_date: any,
        start_date: string,
        banner: string,
    }
}

export default function SubjectCard({subject}: SubjectCardProps) {
    return (
        <Link className={styles.Card} href={"/subject/"+subject.id} key={subject.id}>
            <Image src={subject.banner} alt="subject banner"
                   preview={false} style={{
                width: "100%",
                height: "100px",
                objectFit: "cover",
                objectPosition: "center",
            }}></Image>
            <Divider style={{margin: 0}}></Divider>
            <Flex vertical style={{
                padding: "12px 16px 12px 16px",
                justifyContent: "space-between",
                maxHeight: "40%",
                background: "var(--foreground-lighter)",
            }}>
                <h3 className={styles.subjectTitle}>{subject.title}</h3>
                <Link className={styles.teacherLink} href={"/profile/" + subject.teacher_id}>{
                    tempTeachers.find(teacher => teacher.id === subject.teacher_id)?.first_name + " " +
                    tempTeachers.find(teacher => teacher.id === subject.teacher_id)?.last_name
                }</Link>
            </Flex>
        </Link>
    )
}