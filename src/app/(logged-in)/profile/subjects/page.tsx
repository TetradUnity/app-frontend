'use client'
import {Divider, Flex, Input, Radio, RadioChangeEvent, Space} from "antd";
import {useState} from "react";
import './page.css'

export default function ProfileSubjects() {
    const [sort, setSort] = useState("name");
    const [view, setView] = useState("list");
    const [sortOrder, setSortOrder] = useState("asc");

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
            gap:'var(--gap)',
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
                <Radio.Group value={view} onChange={onChangeView} style={{margin: "8px 0", padding:"0 12px"}}>
                    <Space direction="vertical" size="small">
                        <Radio value={"list"}>Список</Radio>
                        <Radio value={"grid"}>Плитка</Radio>
                    </Space>
                </Radio.Group>
                <Divider style={{margin: 0}} plain orientation="left">Сортування</Divider>
                <Radio.Group value={sort} onChange={onChangeSort} style={{margin: "8px 0", padding:"0 12px"}}>
                    <Space direction="vertical" size="small">
                        <Radio value={"name"}>По назві</Radio>
                        <Radio value={"date"}>По даті створення</Radio>
                        <Radio value={"studentCount"}>По кількості студентів</Radio>
                    </Space>
                </Radio.Group>
                <Divider style={{margin: 0}}></Divider>
                <Radio.Group value={sortOrder} onChange={onChangeSortOrder} style={{margin: "8px 0", padding:"0 12px"}}>
                    <Space direction="vertical" size="small">
                        <Radio value={"asc"}>За зростанням</Radio>
                        <Radio value={"desc"}>За спаданням</Radio>
                    </Space>
                </Radio.Group>
            </Space>

            <Flex vertical gap='var(--gap)' >
                <Input placeholder="Фільтр по назві" style={{position:"relative",flexGrow:1, gridArea: "search",}}></Input>
                <Space size={[8,16]} wrap style={{background: 'var(--foreground)', borderRadius: 8, padding: "12px 16px", gridArea:"content"}}>
                    {new Array(200).fill(null).map((_, index) => (
                        <h1>Subject</h1>
                    ))}
                </Space>
            </Flex>
        </div>
    )
}