'use client'

import {Button, Divider, Dropdown, Flex, Image, Input, MenuProps, Radio, Space} from "antd";
import {useState} from "react";
import {CaretDownOutlined, SearchOutlined, SortAscendingOutlined, SortDescendingOutlined} from "@ant-design/icons";
import {tempSubjects, tempTeachers} from "@/temporary/data";
import Link from "next/link";
import styles from "@/app/(logged-in)/profile/[profileId]/subjects/styles.module.css";


const items: MenuProps['items'] = [
    {
        label: "По назві",
        key: '0',
    },
    {
        label: "По даті початку",
        key: '1',
    },
    {
        label: "По кількості студентів",
        key: '2',
    },
    {key: 'divider', type: 'divider'},
    {
        label: "За зростанням",
        key: '3',
    },
    {
        label: "За спаданням",
        key: '4',
    },
]

export default function Subjects() {
    const [sortBy, setSortBy] = useState("По назві");
    const [sortOrder, setSortOrder] = useState("asc");

    const onClick: MenuProps['onClick'] = ({key}) => {
        switch (key) {
            case '0':
                setSortBy("По назві");
                break;
            case '1':
                setSortBy("По даті початку");
                break;
            case '2':
                setSortBy("По кількості студентів");
                break;
            case '3':
                setSortOrder("asc");
                break;
            case '4':
                setSortOrder("desc");
                break;
        }
    }

    return (
        <Flex gap='var(--gap)'>
            <Flex vertical gap='var(--gap)' style={{
                background: 'var(--foreground)',
                padding: "12px 16px",
                borderRadius: 8,
                flexGrow: 1,
            }}>
                <Flex justify="space-between" align="flex-end">
                    <h2 style={{fontWeight: 350}}>Предмети</h2>
                    <Dropdown menu={{items, onClick}} trigger={["click"]} overlayStyle={{paddingTop: 12}}
                              placement="bottomRight">
                        <Button size="small" style={{
                            display: "flex",
                            alignItems: "center",
                            borderRadius: 8,
                        }}>
                            {sortOrder === "asc" ? <SortAscendingOutlined/> : <SortDescendingOutlined/>}
                            {sortBy}
                            <CaretDownOutlined style={{fontSize: 12}}/>
                        </Button>
                    </Dropdown>
                </Flex>
                <Input placeholder="Фільтр по назві" prefix={<SearchOutlined/>}/>
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
                            <Image src={subject.banner} alt="subject banner"
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
                </div>
            </Flex>
            <div style={{
                background: 'var(--foreground)',
                padding: "12px 16px",
                borderRadius: 8,
                position: "sticky",
                top: 'calc(58px + var(--gap))',
                height: "fit-content",
                maxWidth: "330px",
            }}>
                <h2>Фільтри (TODO)</h2>
                <Space direction="vertical" size="large">
                    <Radio.Group>
                        <Radio value={1}>Активні</Radio>
                        <Radio value={2}>Неактивні</Radio>
                    </Radio.Group>
                    <Radio.Group>
                        <Radio value={1}>З екзаменом</Radio>
                        <Radio value={2}>Без екзамену</Radio>
                    </Radio.Group>
                    <Radio.Group>
                        <Radio value={1}>Завершені</Radio>
                        <Radio value={2}>Не завершені</Radio>
                    </Radio.Group>
                </Space>
            </div>
        </Flex>
    );
}