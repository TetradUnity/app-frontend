'use client';

import { IStudentShortInfo } from "@/types/api.types";
import styles from "../styles.module.css";
import Link from "next/link";
import { useEffect } from "react";
import { SubjectService } from "@/services/subject.service";
import { useSubjectStore } from "@/stores/subjectStore";
import { Avatar, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import {useShallow} from "zustand/react/shallow";
import {getUserAvatar} from "@/utils/OtherUtils";

function StudentSlot({item} : {item: IStudentShortInfo}) {
    return (
        <div className={styles.material_slot + " " + styles.student_slot}>
            <Link href={"/profile/" + item.id}>
                <Avatar
                    src={getUserAvatar(item.avatar)}
                    shape="square"
                    className={styles.student_avatar}
                    size="large"
                    alt="avatar"
                />
                <h2>{item.first_name} {item.last_name}</h2>
            </Link>
         </div>
    )
}

export default function SubjectStudentsPage() {
    const subject_id = useSubjectStore(useShallow(state => state.subject.id));

    const [students, status] = useSubjectStore(useShallow(state => [state.students, state.studentsFetchingStatus]));

    if (status == "fetching") {
        return (
            <Spin
                style={{display: "block", margin: "auto"}}
                indicator={<LoadingOutlined style={{fontSize: 60}}/>}
                spinning={true}
            />
        );
    }
    if (status == "error") {
        return (
            <p style={{fontSize: 30, textAlign: "center"}}>Сталася помилка. Попробуйте ще раз!</p>
        );
    }

    return (
        students.map((item, k) => <StudentSlot item={item} key={k} />)
    )
}