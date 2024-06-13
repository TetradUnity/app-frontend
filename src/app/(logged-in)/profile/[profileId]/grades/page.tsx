'use client'
import {Collapse, Divider, Flex, Input, Radio, RadioChangeEvent, Space} from "antd";
import {useEffect, useState} from "react";
import styles from "./styles.module.css"
import {SearchOutlined} from "@ant-design/icons";
import Link from "next/link";
import {useQueryProfileStore} from "@/stores/queryProfileStore";

const items = [{
    label: "subjectName",
    children: <>
        {new Array(8).fill(null).map((_, index) => (
            <Flex justify="space-between" style={{padding: "0px 16px"}}>
                <Link href="/subject/id/task/id" style={{
                    display: "inline-block",
                    maxWidth: "80%",
                    overflow: "clip",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}>Завдання</Link>

                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100px",
                }}>
                    {Math.random() > 0.33 ? <span style={{color: "#4bcf4b"}}>
                         {Math.random() > 0.5 ? "5" : Math.random() > 0.5 ? "4" : "3"}
                    </span> : <span style={{color: "#eb5353"}}>Не оцінено</span>
                    }
                </div>
            </Flex>
        ))}
    </>
}]

export default function ProfileGrades() {
    const [sort, setSort] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchText, setSearchText] = useState("");

    const profile = useQueryProfileStore();

    const onChangeSortOrder = (e: RadioChangeEvent) => {
        setSortOrder(e.target.value)
    }
    const onChangeSort = (e: RadioChangeEvent) => {
        setSort(e.target.value)
    }

    useEffect(() => {
        document.title = "Оцінки / " + profile.first_name + " " + profile.last_name;
    }, []);

    const sortingBlock = document.getElementById("sorting-block")
    let sortingBlockWidth = sortingBlock !== null ? sortingBlock.offsetWidth : 0
    return (
        <>
            {profile.isMe ?
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
                    <Space id="sorting-block" style={{
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
                        <Divider style={{margin: 0}} plain orientation="left">Сортування предметів</Divider>
                        <Radio.Group value={sort} onChange={onChangeSort} style={{margin: "8px 0", padding: "0 12px"}}>
                            <Space direction="vertical" size="small">
                                <Radio value={"name"}>По назві</Radio>
                                <Radio value={"lastGrade"}>По даті останньої оцінки</Radio>
                                <Radio value={"enrollDate"}>По даті приєднання</Radio>
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
                    <Flex vertical gap='var(--gap)' style={{maxWidth: 1200 - sortingBlockWidth}}>
                        <Input placeholder="Пошук предметів" prefix={<SearchOutlined/>}
                               onChange={e => setSearchText(e.target.value)}
                               style={{position: "relative", flexGrow: 1, gridArea: "search",}}></Input>
                        {/* todo when subjects will be in api */}
                        <Flex vertical style={{background: 'var(--foreground)', borderRadius: 8, gridArea: "content"}}>
                            {new Array(5).fill(null).map((_, index) => (
                                <Collapse className={styles.collapse} key={index} ghost items={items}/>
                            ))}
                        </Flex>
                    </Flex>
                </div> : <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    fontSize: 24,
                    color: "var(--text-secondary)"
                }}>У вас немає доступу до цієї сторінки</div>
            }
        </>
    );
}