'use client';

import { SubjectNamespace } from "@/types/api.types"
import { Avatar, Divider, Empty, Spin } from "antd"

import { ArrowRightOutlined } from "@ant-design/icons";

import styles from "./styles.module.css";
import { useEffect, useRef, useState } from "react";
import MaterialViewerModal from "./MaterialViewerModal";
import { getUserAvatar } from "@/utils/OtherUtils";
import TestResultViewerModal from "./TestResultViewerModal";
import { useParams } from "next/navigation";
import { EducationService } from "@/services/education.service";
import dayjs from "dayjs";
import translateRequestError from "@/utils/ErrorUtils";
import { pluralize } from "@/utils/InternalizationUtils";

type ResultForTeacherProps = {
    type: "material" | "test"
}
export default function ResultForTeacher({type} : ResultForTeacherProps) {
    const { id } = useParams();

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<SubjectNamespace.IStudentHomeworkShortInfo | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [students, setStudents] = useState<SubjectNamespace.IStudentHomeworkShortInfo[]>([]);
    const [totalStudents, setTotalStudents] = useState(0);
    const [averageGrade, setAvarageGrade] = useState(0);

    const fetchRef = useRef({
        loading: false,
        page: 1,
        isEnd: false
    });

    const modalProps = {
        isOpen: modalVisible,
        student: selectedStudent,
        close: () => setModalVisible(false),
        setStudent: (student: SubjectNamespace.IStudentHomeworkShortInfo) => setStudents(students.map(s => (s.id == student.id) ? student : s))
    }

    const fetch = () => {
        if (fetchRef.current.isEnd) return;
        if (fetchRef.current.loading) return;

        setLoading(true);
        fetchRef.current.loading = true;

        EducationService.viewHomeworks(parseInt(id as string), fetchRef.current.page).then(resp => {
            if (!resp.success) {
                setError(resp.error_code!);
                return;
            }
            
            setStudents(prev => [...prev, ...resp.data!]);
            setTotalStudents(resp.count_homework!);
            setAvarageGrade(resp.average_grade!);
            fetchRef.current.isEnd = resp.data!.length == 0;
            fetchRef.current.page += 1;
            fetchRef.current.loading = false;
            setLoading(false);
        });
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

    if (error) {
        return <p style={{textAlign: "center", fontSize: 20, marginTop: 5}}>Не вдалося завантажити учнів: {translateRequestError(error)}</p>
    }

    if (loading) {
        return <Spin style={{display: "block", margin: "auto"}} size="large" spinning />
    }

    if (students.length < 1) {
        return <Empty description="Немає жодного студента." />
    }

    return (
        <>
            <p>Кількість виконаних робіт: {totalStudents}</p>
            <p>Середній бал: {totalStudents}</p>

            <Divider style={{margin: "10px 0"}} />

            {students.map(student => 
                <button key={student.id} onClick={() => {
                    setSelectedStudent(student);
                    setModalVisible(true);
                }} className={styles.student_slot}>
                    <Avatar style={{marginRight: 10}} size="large" shape="square" src={getUserAvatar(student.avatar)} />

                    <div>
                        <p className={styles.ss_name}>
                            {student.first_name + " " + student.last_name}
                            <span className={styles.divider}>{" | "}</span>
                            {(student.value > 0)
                                ? <span className={styles.evaluated}>
                                    {pluralize(Math.round(student.value), ['бал', 'бала', 'балів'])}
                                    {(student.attempt > 1) ? ("з " + student.attempt + "спроби") : null}
                                </span>
                                : <span className={styles.unevaluated}>Не оцінений</span>
                            }
                        </p>
                        <p className={styles.ss_dispatchtime}>Здав {dayjs(student.dispatch_time).format("D MMMM о HH:mm")}</p>
                    </div>

                    <ArrowRightOutlined />
                </button>
            )}

            {type == "material"
                ? <MaterialViewerModal {...modalProps} />
                : <TestResultViewerModal {...modalProps} />
            }
        </>
    )
}