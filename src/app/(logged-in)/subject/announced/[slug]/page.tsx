'use client';

import { tempSubjects, tempTeachers } from "@/temporary/data"
import { IAnnouncedSubject, IUser, TemporaryAnnoncedSubjectInfo } from "@/types/api.types";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { DeleteOutlined, ProfileOutlined, LinkOutlined, CheckOutlined, ClockCircleOutlined, CalendarOutlined, FieldTimeOutlined } from "@ant-design/icons";
import { Button, Divider, Modal, Spin, Table, TableColumnsType, Tooltip } from "antd";

import styles from "./styles.module.css";
import Link from "next/link";
import dayjs from "dayjs";
import AnnouncedSubjectRequestModal from "@/components/modals/AnnouncedSubjectRequestModal";
import { SubjectService } from "@/services/subject.service";
import { formatTimeInSeconds } from "@/utils/TimeUtils";
import Tiptap from "@/components/Tiptap";
import { useProfileStore } from "@/stores/profileStore";
import { useShallow } from "zustand/react/shallow";
import useModal from "antd/es/modal/useModal";
import translateRequestError from "@/utils/ErrorUtils";

interface DataType {
    key: React.Key,
    firstNameAndLastName: string,
    grade: number,
}

const MOCK_ANNOUNCED_SUBJECT_STUDENTS_DATA: DataType[] = [
    {
        key: '1',
        firstNameAndLastName: "Іван Верба",
        grade: 60
    },
    {
        key: '2',
        firstNameAndLastName: "Федір Остапчий",
        grade: 80
    },
    {
        key: '3',
        firstNameAndLastName: "Галина Кущ",
        grade: 30
    }
];

const announcedSubjectStudentsColumns: TableColumnsType<DataType> = [
    {
        title: "Ім'я та фамілія",
        dataIndex: "firstNameAndLastName",
    },
    {
        title: "Бал",
        dataIndex: "grade",
        showSorterTooltip: { target: 'full-header' },
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.grade - b.grade,
    },
    {
        title: "Операція",
        width: 1,
        render: (_, record) => {
            return (
                <Tooltip title="Відказати студенту бути участником вашого предмету">
                    <Button
                        type="primary"
                        shape="circle"
                        danger
                        icon={<DeleteOutlined />}
                        style={{display: "block", margin: "auto"}}
                    />
                </Tooltip>
            )
        }
    }
];

const ForTeacherRender = () => {
    const examEnded = true;
    return (
        <>
            <Divider />

            {
                !examEnded
                ? <p style={{textAlign: "center"}}>Ви побачите список студентів, які подали заявку на вступ до вашого предмета і зможете видаляти тих, які на вашу думку не підходять, після того, як закінчиться іспит.</p>
                : <Table
                    dataSource={MOCK_ANNOUNCED_SUBJECT_STUDENTS_DATA}
                    columns={announcedSubjectStudentsColumns}
                    bordered
                />
            }
        </>
    );
}

export default function AnnouncedSubject() {
    const params = useParams();
    let { slug } = params;

    const [info, setInfo] = useState<IAnnouncedSubject>();

    const [isLoaded, setIsLoaded] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);

    const [loading, setLoading] = useState(false);

    const [modal, ctx] = useModal();

    const role = useProfileStore(useShallow(state => state.role));
    const email = useProfileStore(useShallow(state => state.email));

    const register = (email: string, first_name?: string, last_name?: string) => {
        if (!first_name) {
            first_name = undefined;
        }
        if (!last_name) {
            last_name = undefined;
        }
        
        setLoading(true);

        SubjectService.register(parseInt(slug as string), email, first_name, last_name).then(response => {
            setLoading(false);

            if (!response.success) {
                modal.error({
                    title: "Помилка.",
                    content: <p>{translateRequestError(response.error_code)}</p>
                })
                return;
            }

            modal.success({
                title: "Успіх!",
                content: <p>Протягом найближчого часу очікуйте лист в своїй поштовій скринькі.</p>
            })
        })
    }

    const onClickedRegister = () => {
        if (role == "GUEST") {
            setModalVisible(true);
            return;
        }

        if (!email) {
            return;
        }

        register(email);
    }

    useEffect(() => {
        let subjectId = parseInt(slug as string);

        if (!subjectId || subjectId < 0) {
            notFound();
        }

        SubjectService.getAnnouncedSubjectInfo(subjectId).then(response => {
            setIsLoaded(true);

            if (!response.success) {
                notFound();
            }

            // @ts-ignore
            setInfo(response.data);
        })
    }, [])

    if (!isLoaded) {
        return null;
    }

    if (!info) {
        notFound();
    }
    
    return (
        <div className={styles.slot}>
            <div className={styles.banner}>
                <img src="https://gstatic.com/classroom/themes/Honors.jpg" alt="banner" />
                <h1>{info.title}</h1>
                <Link href={"/profile/"+info.teacher_id}>
                    <LinkOutlined style={{marginRight: 5}} />
                    {info.teacher_first_name} {info.teacher_last_name}
                </Link>
            </div>

           <div className={styles.content}>
                <section>
                    <h1><ProfileOutlined style={{color: "#eab676"}} /> Опис:</h1>
                    <Tiptap
                        editable={false}
                        content={info.description}
                        charsLimit={10000}
                    />
                </section>

                <section>
                    <h1><ClockCircleOutlined style={{color: "#68a2ed"}} /> Тривалість:</h1>
                    <p>{formatTimeInSeconds(info.duration / 1000)}</p>
                </section>

                <section>
                    <h1><CalendarOutlined style={{color: "#e62780"}} /> Розклад заннять:</h1>
                    <p>{info.timetable}</p>
                </section>

                <section>
                    <h1><CheckOutlined style={{color: "#00ff5e"}} /> Вступний екзамен:</h1>
                    <p>{info.time_exam_end ? "Існує" : "Не існує"}</p>
                </section>
                
                {info.time_exam_end &&
                    <>
                        <section>
                            <h1><FieldTimeOutlined style={{color: "#abdbe3"}} /> Екзамен можна здати до:</h1>
                            <p>{dayjs(info.time_exam_end).format("D MMMM YYYY року")}</p>
                        </section>

                        <section>
                            <h1><FieldTimeOutlined style={{color: "#abdbe3"}} /> Тривалість екзамену:</h1>
                            <p>{formatTimeInSeconds(info.duration_exam)}</p>
                        </section>
                    </>
                }
                
                <section>
                    <h1><FieldTimeOutlined style={{color: "#abdbe3"}} /> Початок предмету:</h1>
                    <p>{dayjs(info.time_start).format("D MMMM YYYY року")}</p>
                </section>

                {(role == "STUDENT" || role == "GUEST") && 
                    <Button onClick={onClickedRegister} style={{display: "block", margin: "auto"}} type="primary">
                        {info.time_exam_end ? "Подати заявку" : "Зареєструвати мене"}
                    </Button>
                }

                {role == "TEACHER" &&
                    <ForTeacherRender />
                }
           </div>

           {loading && <Spin fullscreen />}
           {ctx}
           <AnnouncedSubjectRequestModal
            isOpen={modalVisible}
            close={() => setModalVisible(false)}
            callback={register}
           />
        </div>
    )
}