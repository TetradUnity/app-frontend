'use client';

import { IStudentShortInfo } from "@/types/api.types";
import styles from "../styles.module.css";
import Link from "next/link";
import { useEffect } from "react";
import { SubjectService } from "@/services/subject.service";
import { useSubjectStore } from "@/stores/subjectStore";
import { Avatar, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';

function StudentSlot({item} : {item: IStudentShortInfo}) {
    return (
        <div className={styles.material_slot + " " + styles.student_slot}>
            <Link href={"/profile/" + item.id}>
                <Avatar shape="square" className={styles.student_avatar} size="large" src={"https://media.licdn.com/dms/image/C5603AQE-LZbyqja3GQ/profile-displayphoto-shrink_800_800/0/1585481402347?e=2147483647&v=beta&t=0jx6LRb9wlnWNVNSWzmXAVnDWwvFGVO_klpqm94TynY"} alt="avatar" />
                <h2>{item.first_name} {item.last_name}</h2>
            </Link>
         </div>
    )
}

export default function SubjectStudentsPage() {
    const subject_id = useSubjectStore(state => state.subjectId);

    const students = useSubjectStore(state => state.students);
    const students_fetch_status = useSubjectStore(state => state.studentsFetchingState);

    const updateStudents = useSubjectStore(state => state.updateStudents);
    const updateFetchStatus = useSubjectStore(state => state.updateFetchStatus);

    useEffect(() => {
        if (students_fetch_status != "not_fetched") {
            return;
        }
        if (subject_id == -1) {
            return;
        }

        updateFetchStatus("fetching");

        SubjectService.mock.getStudents(subject_id).then(res => {
            if (!res.success) {
                console.log(subject_id, res)
                updateFetchStatus("error");
                return;
            }

            updateStudents(res.data);
        })
    }, [subject_id]);

    if (students_fetch_status == "fetching") {
        return (
            <Spin
                    style={{display: "block", margin: "auto"}}
                    indicator={<LoadingOutlined style={{fontSize: 60}}/>}
                    spinning={true}
                />
        );
    }
    if (students_fetch_status == "error") {
        return (
            <p className={styles.empty_text}>Сталася помилка. Попробуйте ще раз!</p>
        );
    }

    return (
        students.map((item, k) => <StudentSlot item={item} key={k} />)
    )
}