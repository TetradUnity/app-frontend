import {Divider, Flex, Image, Tag} from "antd";
import styles from "./subject.module.css";
import Link from "next/link";
import { ISubjectShort } from "@/types/api.types";
import { UploadService, UploadType } from "@/services/upload.service";

import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";

type Props = {
    subject: ISubjectShort
};
export default function SubjectCard({subject} : Props) {
    return (
        <Link className={styles.Card + " " + styles.defaultCard} href={"/subject/" + subject.id} key={subject.id}>
            {/* UploadService.getImageURL(UploadType.BANNER, subject.banner) */}
            <Image src={subject.banner} alt="subject banner"
                   preview={false} style={{
                width: "100%",
                height: "100px",
                objectFit: "cover",
                objectPosition: "center",
            }} />

            <Divider style={{margin: 0}}></Divider>
            <Flex vertical style={{
                padding: "12px 16px 12px 16px",
                justifyContent: "space-between",
                background: "var(--foreground-lighter)",
                flex: 1
            }}>
                <div>
                    <h3 className={styles.subjectTitle}>
                        {subject.title}
                    </h3>
                    {(subject.teacher_id != null) &&
                        <Link className={styles.teacherLink} href={"/profile/" + subject.teacher_id}>
                            {subject.teacher_first_name + " " + subject.teacher_last_name}
                        </Link>
                    }
                </div>

                
                {subject.type == "ACTIVE_SUBJECT" &&
                    <p style={{marginTop: 10, fontSize: 15}}>
                        <UserOutlined />
                        25
                    </p>
                }
                {subject.type == "ANNOUNCED_SUBJECT" &&
                    <p style={{marginTop: 10, fontSize: 15, color: "rgb(210,210,0)"}}>
                        <ClockCircleOutlined style={{marginRight: 7}} />
                        До початку відбору залишось 5 днів
                    </p>
                }
                {subject.type == "PREPARING_SUBJECT" &&
                    <p style={{marginTop: 10, fontSize: 15, color: "rgb(210,0,0)"}}>
                        <ClockCircleOutlined style={{marginRight: 7}} />
                        Вам потрібно сформувати список.
                        Залишилось 5 днів!
                    </p>
                }
                 {subject.type == "READY_SUBJECT" &&
                    <p style={{marginTop: 10, fontSize: 15, color: "rgb(0,210,0)"}}>
                        <ClockCircleOutlined style={{marginRight: 7}} />
                        До початку предмета залишось 5 днів
                    </p>
                }
            </Flex>
        </Link>
    )
}