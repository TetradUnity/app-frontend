'use client';

import { tempSubjects, tempTeachers } from "@/temporary/data"
import { IUser, TemporaryAnnoncedSubjectInfo } from "@/types/api.types";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { DeleteOutlined, ProfileOutlined, LinkOutlined, CheckOutlined, ClockCircleOutlined, CalendarOutlined, FieldTimeOutlined } from "@ant-design/icons";
import { Button, Divider, Table, TableColumnsType, Tooltip } from "antd";

import styles from "./styles.module.css";
import Link from "next/link";
import dayjs from "dayjs";
import AnnouncedSubjectRequestModal from "@/components/modals/AnnouncedSubjectRequestModal";

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
                <Tooltip title="Відказати студенту бути в вашому предметі">
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

    const [info, setInfo] = useState<TemporaryAnnoncedSubjectInfo>();
    const [teacherInfo, setTeacherInfo] = useState<IUser>();

    const [isLoaded, setIsLoaded] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);

    /* Temporary */
    const isTeacher = true;

    useEffect(() => {
        let subjectId = parseInt(slug as string);

        if (!subjectId || subjectId < 0) {
            notFound();
        }

        let info = tempSubjects[subjectId - 1];

        setInfo(info);
        setTeacherInfo(tempTeachers[info?.teacher_id - 1]);

        setIsLoaded(true);
    }, [])

    if (!isLoaded) {
        return null;
    }

    if (!(info && teacherInfo)) {
        notFound();
    }

    return (
        <div className={styles.slot}>
            <div className={styles.banner}>
                <img src={info.banner} alt="banner" />
                <h1>{info.title}</h1>
                <Link href={"/profile/"+info.teacher_id}>
                    <LinkOutlined style={{marginRight: 5}} />
                    {teacherInfo.first_name} {teacherInfo.last_name}
                </Link>
            </div>

           <div className={styles.content}>
                <section>
                    <h1><ProfileOutlined style={{color: "#eab676"}} /> Опис:</h1>
                    <p>{info.description}</p>
                </section>

                <section>
                    <h1><ClockCircleOutlined style={{color: "#68a2ed"}} /> Тривалість:</h1>
                    <p>{info.duration}</p>
                </section>

                <section>
                    <h1><CalendarOutlined style={{color: "#e62780"}} /> Розклад заннять:</h1>
                    <p>{info.timetable}</p>
                </section>

                <section>
                    <h1><CheckOutlined style={{color: "#00ff5e"}} /> Вступний екзамен:</h1>
                    <p>{info.exam ? "Є" : "Немає"}</p>
                </section>

                {info.exam &&
                    <section>
                        <h1><FieldTimeOutlined style={{color: "#abdbe3"}} /> Екзамен можна здати до:</h1>
                        <p>{info.exam_end_date}</p>
                    </section>}
                
                <section>
                    <h1><FieldTimeOutlined style={{color: "#abdbe3"}} /> Початок предмету:</h1>
                    <p>{dayjs(info.start_date).format("D MMMM YYYY року")}</p>
                </section>

                {!isTeacher && 
                    <Button onClick={() => setModalVisible(true)} style={{display: "block", margin: "auto"}} type="primary">
                        {info.exam ? "Подати заявку" : "Зареєструвати мене"}
                    </Button>
                }

                {isTeacher &&
                    <ForTeacherRender />
                }
           </div>

           <AnnouncedSubjectRequestModal
            isOpen={modalVisible}
            close={() => setModalVisible(false)}
           />
        </div>
    )
}