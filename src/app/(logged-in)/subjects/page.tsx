'use client'

import {Button, Dropdown, Flex, Input, MenuProps, Radio, Space} from "antd";
import {useState} from "react";
import {CaretDownOutlined, SearchOutlined, SortAscendingOutlined, SortDescendingOutlined} from "@ant-design/icons";
import {tempSubjects} from "@/temporary/data";
import SubjectCard from "@/components/cards/SubjectCard";


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
                        <SubjectCard key={subject.id} subject={subject}/>
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