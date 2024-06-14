'use client';

import { IStudentShortInfo } from "@/types/api.types";
import styles from "../styles.module.css";
import Link from "next/link";
import { Avatar, Divider, Spin, message } from "antd";
import {getUserAvatar} from "@/utils/OtherUtils";
import { useEffect, useRef, useState } from "react";
import { SubjectService } from "@/services/subject.service";
import { useParams } from "next/navigation";
import translateRequestError from "@/utils/ErrorUtils";
import { pluralize } from "@/utils/InternalizationUtils";

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
                <div>
                    <h2>{item.first_name} {item.last_name}</h2>
                    {(item.average_grade)
                        ? <p>Середні бал: {Math.round(item.average_grade)}</p>
                        : null
                    }
                </div>
            </Link>
         </div>
    )
}

export default function SubjectStudentsPage() {
    const { slug } = useParams();

    const [students, setStudents] = useState<IStudentShortInfo[]>([]);
    const [totalStudents, setTotalStudents] = useState(0);

    const [loading, setLoading] = useState(false);

    const [msg, msgCtx] = message.useMessage();

    const fetchRef = useRef({
        loading: false,
        page: 1,
        isEnd: false
    });

    const fetch = async () => {
        if (fetchRef.current.isEnd) return;
        if (fetchRef.current.loading) return;

        setLoading(true);
        fetchRef.current.loading = true;

        const response = await SubjectService.getStudents(parseFloat(slug as string), fetchRef.current.page);

        if (!response.success) {
            setLoading(false);
            msg.error("Трапилась помилка при завантажені студентів: " + translateRequestError(response.error_code))
            return;
        }

        setStudents(prev => [...prev, ...response.data!]);
        setTotalStudents(response.count!);
        fetchRef.current.isEnd = response.data!.length == 0;
        fetchRef.current.page += 1;
        fetchRef.current.loading = false;
        setLoading(false);
    }

    useEffect(() => {
        fetch();

        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) {
                return;
            }

            fetch();
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {loading
                ? <Spin size="large" style={{display: "block", margin: "auto"}} spinning />
                : <>
                    <h1 className={styles.studentsTitle}>{pluralize(totalStudents, ["студент", "студента", "студентів"])}</h1>

                    <Divider className={styles.studentsDivider} />

                    {students.map((item, k) => <StudentSlot item={item} key={k} />)}
                </>
            }
            {msgCtx}
        </>
    )
}