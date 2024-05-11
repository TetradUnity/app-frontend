'use client'
import {Divider, Input, Radio, RadioChangeEvent, Space} from "antd";
import {useState} from "react";

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
        <Space style={{alignItems:"flex-start", gap:'var(--gap)'}}>
            <Space style={{
                display: "block",
                background: 'var(--foreground)',
                borderRadius: 8,
                padding: "12px 16px",
                width: "max-content"
            }}>

                <Divider style={{margin: 0}} plain orientation="left">Вигляд</Divider>
                <Radio.Group value={view} onChange={onChangeView} style={{margin: "8px 0"}}>
                    <Space direction="vertical" size="small">
                        <Radio value={"list"}>Список</Radio>
                        <Radio value={"grid"}>Плитка</Radio>
                    </Space>
                </Radio.Group>

                <Divider style={{margin: 0}} plain orientation="left">Сортування</Divider>
                <Radio.Group value={sort} onChange={onChangeSort} style={{margin: "8px 0"}}>
                    <Space direction="vertical" size="small">
                        <Radio value={"name"}>По назві</Radio>
                        <Radio value={"date"}>По даті створення</Radio>
                        <Radio value={"studentCount"}>По кількості студентів</Radio>
                    </Space>
                </Radio.Group>
                <Divider style={{margin: 0}}></Divider>
                <Radio.Group value={sortOrder} onChange={onChangeSortOrder} style={{margin: "8px 0"}}>
                    <Space direction="vertical" size="small">
                        <Radio value={"asc"}>За зростанням</Radio>
                        <Radio value={"desc"}>За спаданням</Radio>
                    </Space>
                </Radio.Group>
            </Space>
            <Space direction="vertical" style={{display: "flex"}}>
                <Input placeholder="Фільтр по назві" style={{position:"relative",flexGrow:1}}></Input>
                <Space size={[8,16]} wrap style={{background: 'var(--foreground)', borderRadius: 8, padding: "12px 16px"}}>
                    {new Array(20).fill(null).map((_, index) => (
                        <h1>Subject</h1>
                    ))}
                </Space>
            </Space>
        </Space>
    )
}