'use client'
import {Button, Divider, Flex, Image, Input, Modal, Radio, RadioChangeEvent, Space} from "antd";
import {useEffect, useState} from "react";
import {useProfileStore} from "@/stores/profileStore";
import {FilterOutlined, RightOutlined, SearchOutlined} from "@ant-design/icons";
import Link from "next/link";
import styles from "./styles.module.css";
import SubjectCard from "@/components/cards/SubjectCard";
import {useQueryProfileStore} from "@/stores/queryProfileStore";
import { tempSubjects, tempTeachers } from "@/app/temporary/data";

// @ts-ignore
const OpenFilterModal = ({openFilterVisible, setOpenFilterVisible, view, setView, sort, setSort, sortOrder, setSortOrder}) => {
    const onChangeSortOrder = (e: RadioChangeEvent) => {
        setSortOrder(e.target.value)
    };

    const onChangeView = (e: RadioChangeEvent) => {
        setView(e.target.value)
    };

    const onChangeSort = (e: RadioChangeEvent) => {
        setSort(e.target.value)
    };

    return (
        <Modal title="Фільтр"
               visible={openFilterVisible}
               onOk={() => setOpenFilterVisible(false)}
               onCancel={() => setOpenFilterVisible(false)}
               footer={null}
               centered
               >
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
        </Modal>
    )
}


export default function ProfileSubjects() {
    const [sort, setSort] = useState("name");
    const [view, setView] = useState("list");
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchText, setSearchText] = useState("");

    const [openFilterVisible, setOpenFilterVisible] = useState(false);

    const profile = useProfileStore();

    const profileQuery = useQueryProfileStore();
    useEffect(() => {
        document.title = `Профіль / ${profileQuery.first_name} ${profileQuery.last_name}`
    }, [])

    const openFilterModal = () => {
        setOpenFilterVisible(true)
    }

    const onChangeSortOrder = (e: RadioChangeEvent) => {
        setSortOrder(e.target.value)
    };

    const onChangeView = (e: RadioChangeEvent) => {
        setView(e.target.value)
    };

    const onChangeSort = (e: RadioChangeEvent) => {
        setSort(e.target.value)
    };
    return (
        <div className={styles.grid}>
            <div className={styles.filterDiv}>
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
            </div>

            <Flex vertical gap='var(--gap)' style={{minWidth: 300}}>
                <div style={{
                    display: "flex",
                    gap: "var(--gap-half)",
                }}>
                    <Input placeholder="Фільтр по назві" prefix={<SearchOutlined/>}
                           onChange={e => setSearchText(e.target.value)}
                           style={{position: "relative", flexGrow: 1, gridArea: "search",}}></Input>
                    <div className={styles.filterBtn}>
                        <Button icon={<FilterOutlined/>} style={{width: "64px"}} onClick={openFilterModal}></Button>
                    </div>

                </div>
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
                                    <Link href={"/subject/" + subject.id} style={{
                                        maxWidth: "160px",
                                        minWidth: "160px",
                                    }}>
                                        <Image src={subject.banner} alt="subject baner" preview={false} style={{
                                            width: "100%",
                                            height: "90px",
                                            borderRadius: "8px",
                                            objectFit: "cover",
                                            objectPosition: "center",
                                        }}/>
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
                            //@ts-ignore
                            <SubjectCard subject={subject} key={subject.id}/>
                        ))}
                    </div>}

                <OpenFilterModal
                    openFilterVisible={openFilterVisible}
                    setOpenFilterVisible={setOpenFilterVisible}
                    view={view}
                    setView={setView}
                    sort={sort}
                    setSort={setSort}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                />
            </Flex>
        </div>
    )
}