'use client';

import TestResult from "@/components/TestResult";
import { EducationService } from "@/services/education.service";
import { GradeService } from "@/services/grade.service";
import { SubjectNamespace, TestsNamespace } from "@/types/api.types";
import translateRequestError from "@/utils/ErrorUtils";
import { Button, Divider, Flex, Input, InputNumber, Modal, Spin, message } from "antd";
import { useEffect, useState } from "react";

const ContentViewer = ({student} : {student: SubjectNamespace.IStudentHomeworkShortInfo}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [questions, setQuestions] = useState<TestsNamespace.Question[] | null>([]);

    useEffect(() => {
        if (student) {
            setError('');
            setQuestions([]);
            setLoading(true);
            
            EducationService.viewHomework(student.id).then(resp => {
                if (!resp.success) {
                    setError(resp.error_code!);
                    return;
                }

                setQuestions(resp.data as TestsNamespace.Question[]);
                setLoading(false);
            })
        }
    }, [student]);

    if (error) {
        return <p style={{textAlign: "center"}}>При завантажені трапилась помилка: {translateRequestError(error)}</p>
    }

    if (loading) {
        return <Spin style={{display: "block", margin: "auto"}} spinning />
    }

    if (!questions) {
        return <p style={{textAlign: "center"}}>Учень не здав тест.</p>
    }

    return (
        <TestResult questions={questions} slotColor="var(--foreground-lighter-0_5)" />
    )
};


type TestResultViewerModalProps = {
    isOpen: boolean,
    student: SubjectNamespace.IStudentHomeworkShortInfo | null,
    setStudent: (student: SubjectNamespace.IStudentHomeworkShortInfo) => void,
    close: () => void
};
export default function TestResultViewerModal({isOpen, student, setStudent, close} : TestResultViewerModalProps) {
    const [grade, setGrade] = useState(0);

    const [msg, msgCtx] = message.useMessage();
    const [blocked, setBlocked] = useState(false);

    useEffect(() => {
        if (student) {
            setGrade(student.value);
        }
    }, [student]);

    const applyGrade = () => {
        if (grade < 1 || grade > 100) {
            msg.error("Бал повинен бути в межах від 1 до 100.");
            return;
        }

        setBlocked(true);

        GradeService.evaluate(grade, student!.id).then(resp => {
            setBlocked(false);

            if (!resp.success) {
                msg.error("Не вдалось виставити бал: " + translateRequestError(resp.error_code));
                return;
            }

            setStudent({
                ...student!,
                value: grade
            });
            close();
            msg.success("Бал був виставлений!");
        })
    }

    return (
        <>
            <Modal
                title="Перегляд тесту студента"
                open={isOpen}
                footer={<Button type="primary" onClick={close}>Закрити</Button>}
                onCancel={close}
            >
                {student &&
                <>
                    <p style={{fontSize: 30, textAlign: "center"}}>{student.first_name} {student.last_name}</p>

                    <Divider style={{marginTop: 15, marginBottom: 15}} />

                    <ContentViewer student={student} />

                    <Divider />

                    <h3 style={{marginBottom: 10}}>Бал:</h3>
                    <Flex gap={10}>
                        <InputNumber
                            value={grade > 0 ? grade : 0}
                            onChange={val => setGrade(val || 0)}
                        />
                        <Button disabled={blocked} onClick={applyGrade}>Змінити</Button>
                    </Flex>
                </>}
            </Modal>

            {msgCtx}
        </>
    )
}