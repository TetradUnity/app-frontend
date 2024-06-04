'use client'

import {Button, Dropdown, Flex, Input, MenuProps, Pagination, Radio, Space, Spin} from "antd";
import {useEffect, useState} from "react";
import { PlusCircleFilled, CaretDownOutlined, SearchOutlined, SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";
import { tempSubjects } from "@/temporary/data";
import SubjectCard from "@/components/cards/SubjectCard";
import Link from "next/link";
import { useProfileStore } from "@/stores/profileStore";
import { useShallow } from "zustand/react/shallow";
import { IAnnouncedSubjectShort } from "@/types/api.types";

import { LoadingOutlined } from '@ant-design/icons';
import { SubjectService, filtersType } from "@/services/subject.service";

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

    const profileRole = useProfileStore(useShallow(state => state.role));

    const [isFetching, setIsFetching] = useState(true);
    const [isError, setIsError] = useState<string | null>(null);
    const [subjects, setSubjects] = useState<IAnnouncedSubjectShort[]>([]);
    const [maximumPages, setMaximumPages] = useState(1);

    const fetch = (page: number, filters?: filtersType) => {
        SubjectService.getAnnouncedSubjects(page, filters).then(res => {
            setIsFetching(false);
            if (!res.success) {
                // @ts-ignore
                setIsError(res.error_code);
                setSubjects([]);
                return;
            }
            
            // @ts-ignore
            setSubjects(res.data);
            // @ts-ignore
            setMaximumPages(res.count_pages);
            setIsError(null);
        })
    }

    useEffect(() => {
        document.title = `Предмети / Пошук`;

        fetch(1);
    }, [])

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
                    <Flex gap={15}>
                        {profileRole == "CHIEF_TEACHER" &&
                            <Button size="small" type="primary" style={{fontSize: 15}} icon={<PlusCircleFilled />}>
                                <Link href="/subject/create">Створити новий предмет</Link>
                            </Button>
                        }

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
                </Flex>
                <Input placeholder="Фільтр по назві" prefix={<SearchOutlined/>}/>

                
                {isFetching &&
                <Spin
                    indicator={<LoadingOutlined style={{fontSize: 60}}/>}
                    spinning={true}
                />}

                <p style={{textAlign: "center"}}>
                    {isError}
                    {((isError == null && isFetching == false) && subjects.length == 0) && "Поки ще порожньо."}
                </p>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: "var(--gap)",
                    gridArea: "content",
                    minWidth: 0,
                    opacity: isFetching ? 0.4 : 1
                }}>
                    {subjects.map(subject => (
                        <SubjectCard key={subject.id} subject={subject}/>
                    ))}
                </div>

                <Pagination
                    simple
                    showSizeChanger={false}
                    defaultCurrent={1}
                    total={maximumPages * 10}
                    pageSize={10}
                    style={{display: "block", margin: "auto"}}
                    disabled={isFetching || (isError != null)}
                />
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