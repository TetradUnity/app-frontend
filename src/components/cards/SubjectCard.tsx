import {Divider, Flex, Image, Tag} from "antd";
import styles from "./subject.module.css";
import Link from "next/link";
import {tempTeachers} from "@/temporary/data";
import { IAnnouncedSubjectShort } from "@/types/api.types";

export default function SubjectCard({subject}: {subject: IAnnouncedSubjectShort}) {
    return (
        <Link className={styles.Card} href={"/subject/announced/" + subject.id} key={subject.id}>
            <Image src="https://gstatic.com/classroom/themes/Honors.jpg" alt="subject banner"
                   preview={false} style={{
                width: "100%",
                height: "100px",
                objectFit: "cover",
                objectPosition: "center",
            }} />
            
            <Flex className={styles.card_tags_div} gap="4px 0" wrap="wrap" justify="flex-end">
                {subject.tags && subject.tags.map(tag => <Tag color="yellow">{tag}</Tag>)}
            </Flex>

            <Divider style={{margin: 0}}></Divider>
            <Flex vertical style={{
                padding: "12px 16px 12px 16px",
                justifyContent: "space-between",
                background: "var(--foreground-lighter)",
            }}>
                <h3 className={styles.subjectTitle}>{subject.title}</h3>
                <Link className={styles.teacherLink} href={"/profile/" + subject.teacher_id}>{
                    tempTeachers.find(teacher => teacher.id === subject.teacher_id)?.first_name + " " +
                    tempTeachers.find(teacher => teacher.id === subject.teacher_id)?.last_name
                }</Link>

                <p style={{marginTop: 10, fontSize: 15}}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius voluptatem enim nisi sequi dicta repellendus voluptates magnam animi obcaecati? Nihil blanditiis aut inventore, ut vel numquam in sunt placeat facere.</p>
            </Flex>
        </Link>
    )
}