'use client';

import { IStudentShortInfo } from "@/types/api.types"
import { Avatar, Empty } from "antd"

import { ArrowRightOutlined } from "@ant-design/icons";

import styles from "./styles.module.css";
import { useState } from "react";
import MaterialViewerModal from "./TestResultViewerModal";
import { getUserAvatar } from "@/utils/OtherUtils";
import TestResultViewerModal from "./TestResultViewerModal";

type ResultForTeacherProps = {
    type: "material" | "test",
    students: IStudentShortInfo[]
}
export default function ResultForTeacher({students, type} : ResultForTeacherProps) {
    if (students.length < 1) {
        return <Empty description="Немає ні єдиного студента." />
    }

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<IStudentShortInfo | null>(null);

    const modalProps = {
        isOpen: modalVisible,
        student: selectedStudent,
        close: () => setModalVisible(false)
    }

    return (
        <>
            {students.map(student => 
                <button key={student.id} onClick={() => {
                    setSelectedStudent(student);
                    setModalVisible(true);
                }} className={styles.student_slot}>
                    <Avatar style={{marginRight: 10}} shape="square" src={getUserAvatar(student.avatar)} />

                    {student.first_name + " " + student.last_name}

                    <ArrowRightOutlined style={{float: "right"}} />
                </button>
            )}
            
            {type == "material"
                ? <MaterialViewerModal {...modalProps} />
                : <TestResultViewerModal {...modalProps} />
            }
        </>
    )
}