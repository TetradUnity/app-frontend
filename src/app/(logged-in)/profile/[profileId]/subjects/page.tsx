'use client'
import {Divider, Flex, Image, Input, Radio, RadioChangeEvent, Space} from "antd";
import {useState} from "react";
import {useProfileStore} from "@/stores/profileStore";
import {RightOutlined, SearchOutlined, UnorderedListOutlined} from "@ant-design/icons";
import Link from "next/link";
import styles from "./styles.module.css"

const tempTeachers = [
    {
        id: 1,
        first_name: "Максим",
        last_name: "Янов",
        email: "",
        role: "teacher",
        isMe: false,
    }
]

const tempSubjects = [
    {
        id: 1,
        title: "Математика",
        teacher_id: 1,
        description: "Опис предмету",
        is_active: true,
        created_at: "2021-09-01T00:00:00",
        exam: null,
        exam_end_date: null,
        start_date: "2023-05-01T00:00:00",
    },
    {
        id: 2,
        title: "Українська мова",
        teacher_id: 1,
        description: "Опис предметуОпис предметуОпис предметуОпис предметуОпис предметуОпис предметуОпис предметуОпис предметуОпис предметуОпис предметуОпис предметуОпис предмету",
        is_active: true,
        created_at: "2021-09-01T00:00:00",
        exam: null,
        exam_end_date: null,
        start_date: "2023-05-01T00:00:00",
    },
    {
        id: 3,
        title: "Іноземна мова",
        teacher_id: 1,
        description: "Опис предмету",
        is_active: true,
        created_at: "2021-09-01T00:00:00",
        exam: null,
        exam_end_date: null,
        start_date: "2023-05-01T00:00:00",
    },
    {
        id: 4,
        title: "Фізика",
        teacher_id: 1,
        description: "Опис предмету",
        is_active: true,
        created_at: "2021-09-01T00:00:00",
        exam: null,
        exam_end_date: null,
        start_date: "2023-05-01T00:00:00",
    },
    {
        id: 5,
        title: "Хімія",
        teacher_id: 1,
        description: "Опис предмету",
        is_active: true,
        created_at: "2021-09-01T00:00:00",
        exam: null,
        exam_end_date: null,
        start_date: "2023-05-01T00:00:00",
    },
    {
        id: 6,
        title: "Біологія",
        teacher_id: 1,
        description: "Опис предмету",
        is_active: true,
        created_at: "2021-09-01T00:00:00",
        exam: null,
        exam_end_date: null,
        start_date: "2023-05-01T00:00:00",
    },
    {
        id: 7,
        title: "Історія Державності та Культури України",
        teacher_id: 1,
        description: "Опис предмету",
        is_active: true,
        created_at: "2021-09-01T00:00:00",
        exam: null,
        exam_end_date: null,
        start_date: "2023-05-01T00:00:00",
    }
]

export default function ProfileSubjects() {
    const [sort, setSort] = useState("name");
    const [view, setView] = useState("list");
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchText, setSearchText] = useState("");

    const profile = useProfileStore();

    const onChangeSortOrder = (e: RadioChangeEvent) => {
        console.log(e.target.value)
        setSortOrder(e.target.value)
    };

    const onChangeView = (e: RadioChangeEvent) => {
        console.log(e.target.value)
        setView(e.target.value)
    };

    const onChangeSort = (e: RadioChangeEvent) => {
        console.log(e.target.value)
        setSort(e.target.value)
    };
    return (
        <div style={{
            display: "grid",
            gap: 'var(--gap)',
            gridTemplateColumns: "auto 1fr",
            gridTemplateRows: "auto 1fr",
            gridTemplateAreas: `
                "sidebar search"
                "sidebar content"
                `,
        }}>
            <Space style={{
                display: "block",
                position: "sticky",
                top: "calc(56px + var(--gap))",
                background: 'var(--foreground)',
                borderRadius: 8,
                padding: "12px 0px",
                width: "max-content",
                height: "max-content",
                zIndex: 50,
                gridArea: "sidebar",
            }}>
                <Divider style={{margin: 0}} plain orientation="left">Вигляд</Divider>
                <Radio.Group value={view} onChange={onChangeView} style={{margin: "8px 0", padding: "0 12px"}}>
                    <Space direction="vertical" size="small">
                        <Radio value={"list"}>Список</Radio>
                        <Radio value={"grid"}>Плитка</Radio>
                    </Space>
                </Radio.Group>
                <Divider style={{margin: 0}} plain orientation="left">Сортування</Divider>
                <Radio.Group value={sort} onChange={onChangeSort} style={{margin: "8px 0", padding: "0 12px"}}>
                    <Space direction="vertical" size="small">
                        <Radio value={"name"}>По назві</Radio>
                        <Radio value={"enrollDate"}>По даті приєднання</Radio>
                        <Radio value={"updateDate"}>По даті обновлення</Radio>
                        <Radio value={"studentCount"}>По кількості студентів</Radio>
                    </Space>
                </Radio.Group>
                <Divider style={{margin: 0}}></Divider>
                <Radio.Group value={sortOrder} onChange={onChangeSortOrder}
                             style={{margin: "8px 0", padding: "0 12px"}}>
                    <Space direction="vertical" size="small">
                        <Radio value={"asc"}>За зростанням</Radio>
                        <Radio value={"desc"}>За спаданням</Radio>
                    </Space>
                </Radio.Group>
            </Space>

            <Flex vertical gap='var(--gap)' style={{minWidth:300}}>
                <Input placeholder="Фільтр по назві" prefix={<SearchOutlined/>}
                       onChange={e => setSearchText(e.target.value)}
                       style={{position: "relative", flexGrow: 1, gridArea: "search",}}></Input>
                {/* todo when subjects will be in api */}
                {view === "list" ?
                    <div style={{
                        background: "var(--foreground)",
                        borderRadius: 8,
                        gridArea: "content",
                    }}>
                        {tempSubjects.map(subject => (
                            <div className={styles.subjectList} key={subject.id}>
                                <Flex gap="var(--gap)" align="center" style={{minWidth: "200px"}}>
                                    <Link href="/subject/id" style={{
                                        maxWidth: "160px",
                                        minWidth: "160px",
                                    }}>
                                        <Image src="https://gstatic.com/classroom/themes/Honors.jpg" alt="subject baner"
                                               preview={false} style={{
                                            width: "100%",
                                            height: "90px",
                                            borderRadius: "8px",
                                            objectFit: "cover",
                                            objectPosition: "center",
                                        }}></Image>
                                    </Link>
                                    <div style={{
                                        display: "block",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        minWidth: "100px",
                                        whiteSpace: "nowrap",
                                    }}>
                                        <Link href="/subject/id">
                                            <h3 className={styles.subjectTitle}>{subject.title}</h3>
                                        </Link>
                                        <Link className={styles.teacherLink} href={"/profile/" + subject.teacher_id}>{
                                            tempTeachers.find(teacher => teacher.id === subject.teacher_id)?.first_name + " " +
                                            tempTeachers.find(teacher => teacher.id === subject.teacher_id)?.last_name
                                        }</Link>
                                    </div>
                                </Flex>
                                <Link href="/subject/id" style={{marginRight: "16px", color: "#fff"}}>
                                    <RightOutlined/>
                                </Link>
                            </div>
                        ))

                        }
                    </div> :
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                        gap: "var(--gap)",
                        gridArea: "content",
                        minWidth: 0,
                    }}>
                        {tempSubjects.map(subject => (
                            <Link href="/subject/id" key={subject.id} style={{
                                background: "var(--foreground)",
                                borderRadius: 8,
                                height: "max-content",
                                minWidth: "1px",
                                maxWidth: "400px",
                                display: "block",
                                color: "var(--text-primary)",
                                overflow: "hidden",
                            }}>
                                <Image src="https://gstatic.com/classroom/themes/Honors.jpg" alt="React logo"
                                       preview={false} style={{
                                    width: "100%",
                                    height: "100px",
                                    objectFit: "cover",
                                    objectPosition: "center",
                                }}></Image>
                                <Divider style={{margin: 0}}></Divider>
                                <Flex vertical style={{
                                    padding: "12px 16px 12px 16px",
                                    justifyContent: "space-between",
                                    maxHeight: "40%",
                                    background: "var(--foreground-lighter)",
                                }}>
                                    <h3 className={styles.subjectTitle}>{subject.title}</h3>
                                    <Link className={styles.teacherLink} href={"/profile/" + subject.teacher_id}>{
                                        tempTeachers.find(teacher => teacher.id === subject.teacher_id)?.first_name + " " +
                                        tempTeachers.find(teacher => teacher.id === subject.teacher_id)?.last_name
                                    }</Link>
                                </Flex>
                            </Link>
                        ))}
                    </div>}
            </Flex>
        </div>
    )
}