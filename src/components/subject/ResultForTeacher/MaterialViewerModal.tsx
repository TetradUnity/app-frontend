'use client';

import { SubjectNamespace } from "@/types/api.types";
import { Button, Divider, Flex, InputNumber, Modal, Spin, message } from "antd";
import { useEffect, useState } from "react";

import FileListViewer from "@/components/FileListViewer";
import { EducationService } from "@/services/education.service";
import { UploadService, UploadType } from "@/services/upload.service";
import translateRequestError from "@/utils/ErrorUtils";
import { GradeService } from "@/services/grade.service";

const ContentViewer = ({student} : {student: SubjectNamespace.IStudentHomeworkShortInfo}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [files, setFiles] = useState<{name: string, url: string}[]>([]);

    useEffect(() => {
        if (student) {
            setError('');
            setFiles([]);
            setLoading(true);
            
            EducationService.viewHomework(student.id).then(resp => {
                if (!resp.success) {
                    setError(resp.error_code!);
                    return;
                }

                setFiles(resp.data!.map(file => ({
                    name: file as string,
                    url: UploadService.getImageURL(UploadType.HOMEWORK, file as string)
                })));
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

    if (files.length < 1) {
        return <p style={{textAlign: "center"}}>Студент нічого не здав.</p>
    }

    return (
        <FileListViewer files={files} />
    )
};

type MaterialViewerModalProps = {
    isOpen: boolean,
    student: SubjectNamespace.IStudentHomeworkShortInfo | null,
    setStudent: (student: SubjectNamespace.IStudentHomeworkShortInfo) => void,
    close: () => void
};
export default function MaterialViewerModal({isOpen, student, setStudent, close} : MaterialViewerModalProps) {
    const [grade, setGrade] = useState(0);

    const [msg, msgCtx] = message.useMessage();
    const [blocked, setBlocked] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if (student) {
            setGrade(student.value);
        }
    }, [student]);

    const applyGrade = () => {
        if (grade < 1 || grade > 100) {
            msg.error("Бал має бути в межах від 1 до 100.");
            return;
        }

        setBlocked(true);

        GradeService.evaluate(grade, student!.id).then(resp => {
            setBlocked(false);

            if (!resp.success) {
                messageApi.error("Не вдалось виставити бал: " + translateRequestError(resp.error_code));
                return;
            }

            setStudent({
                ...student!,
                value: grade
            });
            close();
            messageApi.success("Бал був виставлений!");
        })
    }

    return (
        <>
            <Modal
                title="Перегляд домашнього завдання"
                open={isOpen}
                footer={<Button type="primary" onClick={close}>Закрити</Button>}
                onCancel={close}
            >
                {student &&
                    <>
                        <p style={{fontSize: 30, textAlign: "center"}}>{student.first_name} {student.last_name}</p>

                        <Divider />

                        <ContentViewer student={student} />

                        <Divider />

                        <h3 style={{marginBottom: 10}}>Бал:</h3>
                        <Flex gap={10}>
                            <InputNumber
                                value={grade > 0 ? grade : 0}
                                onChange={val => setGrade(val || 0)}
                            />
                            <Button onClick={applyGrade}>Змінити</Button>
                        </Flex>
                    </>
                }
            </Modal>
            {msgCtx}
            {contextHolder}
        </>
    )
}