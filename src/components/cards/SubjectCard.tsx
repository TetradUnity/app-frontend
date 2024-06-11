import {Divider, Flex, Image, Tag} from "antd";
import styles from "./subject.module.css";
import Link from "next/link";
import { IAnnouncedSubjectShort } from "@/types/api.types";
import { UploadService, UploadType } from "@/services/upload.service";
import { filterProps } from "@/services/subject.service";

const Highlight = ({source, toFind} : {source: string, toFind: string}) => {
    let from = source.toLowerCase().search(toFind.toLowerCase());
    let to = from + toFind.length;

    if (!toFind || from == -1) {
        return <>{source}</>;
    }

    return (
        <>
            {source.substring(0, from)}
            <mark>{source.substring(from, to)}</mark>
            {source.substring(to)}
        </>
    )
}

export default function SubjectCard({subject, filters}: {subject: IAnnouncedSubjectShort, filters: filterProps}) {
    return (
        <Link className={styles.Card} href={"/subject/announced/" + subject.id} key={subject.id}>
            <Image src={UploadService.getImageURL(UploadType.BANNER, subject.banner)} alt="subject banner"
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
                flex: 1
            }}>
                <div>
                    <h3 className={styles.subjectTitle}>
                        <Highlight source={subject.title} toFind={filters.title || ""} />
                    </h3>
                    <Link className={styles.teacherLink} href={"/profile/" + subject.teacher_id}>
                        <Highlight source={subject.teacher_first_name} toFind={filters.first_name_teacher || ""} />
                        {" "}
                        <Highlight source={subject.teacher_last_name} toFind={filters.last_name_teacher || ""} />
                    </Link>
                </div>

                <p style={{marginTop: 10, fontSize: 15}}>{subject.short_description}</p>
            </Flex>
        </Link>
    )
}