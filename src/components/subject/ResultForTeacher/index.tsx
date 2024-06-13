'use client';

import { IStudentShortInfo, SubjectNamespace } from "@/types/api.types"
import { Avatar, Empty, Spin } from "antd"

import { ArrowRightOutlined } from "@ant-design/icons";

import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import MaterialViewerModal from "./MaterialViewerModal";
import { getUserAvatar } from "@/utils/OtherUtils";
import TestResultViewerModal from "./TestResultViewerModal";
import { useParams } from "next/navigation";
import { EducationService } from "@/services/education.service";
import dayjs from "dayjs";
import translateRequestError from "@/utils/ErrorUtils";

type ResultForTeacherProps = {
    type: "material" | "test"
}
export default function ResultForTeacher({type} : ResultForTeacherProps) {
    const { id } = useParams();

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<SubjectNamespace.IStudentHomeworkShortInfo | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [students, setStudents] = useState<SubjectNamespace.IStudentHomeworkShortInfo[]>([]);

    const modalProps = {
        isOpen: modalVisible,
        student: selectedStudent,
        close: () => setModalVisible(false),
        setStudent: (student: SubjectNamespace.IStudentHomeworkShortInfo) => setStudents(students.map(s => (s.id == student.id) ? student : s))
    }

    useEffect(() => {
        EducationService.viewHomeworks(parseInt(id as string)).then(resp => {
            if (!resp.success) {
                setError(resp.error_code!);
                return;
            }
            
            setStudents(resp.data!);
            setLoading(false);
        });
    }, []);

    if (error) {
        return <p style={{textAlign: "center", fontSize: 20, marginTop: 15}}>Не вдалось завантажити учнів: {translateRequestError(error)}</p>
    }

    if (loading) {
        return <Spin style={{display: "block", margin: "auto"}} size="large" spinning />
    }

    if (students.length < 1) {
        return <Empty description="Немає ні єдиного студента." />
    }

    return (
        <>
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
                                    {Math.round(student.value)} балів
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