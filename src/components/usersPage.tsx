'use client'
import {Button, Dropdown, Flex, Input, MenuProps} from "antd";
import {DownOutlined, SearchOutlined, SortAscendingOutlined, SortDescendingOutlined} from "@ant-design/icons";
import UserCard from "@/components/cards/UserCard";
import {useState} from "react";
import {IUser} from "@/types/api.types";

const items : MenuProps['items'] = [
    {
        label: "По імені",
        key: '0',
    },
    {
        label: "По прізвищу",
        key: '1',
    },
    {key: 'divider', type: 'divider'},
    {
        label: "За зростанням",
        key: '2',
    },
    {
        label: "За спаданням",
        key: '3',
    },
]

interface UsersPageProps {
    title: string;
    users: IUser[];
}

export default function UsersPage({ title, users }: UsersPageProps) {
    const [sortBy, setSortBy] = useState("По імені");
    const [sortOrder, setSortOrder] = useState("asc");

    const onClick : MenuProps['onClick'] = ({ key }) => {
        switch (key) {
            case '0':
                setSortBy("По імені");
                break;
            case '1':
                setSortBy("По прізвищу");
                break;
            case '2':
                setSortOrder("asc");
                break;
            case '3':
                setSortOrder("desc");
                break;
        }
    }

    return (
        <Flex vertical gap='var(--gap)'>
            <Flex gap='var(--gap)' style={{
                background: 'var(--foreground)',
                padding: "12px 16px",
                borderRadius: 8,
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
            }}>
                <h3 style={{fontWeight: 450}}>{title}</h3>
                <Input prefix={<SearchOutlined />} placeholder={`Пошук ${title.toLowerCase()}`} />
                <Dropdown menu={{ items, onClick }} trigger={['click']} placement={"bottomRight"}
                          overlayStyle={{ paddingTop: 12 }}>
                    <Button style={{
                        display: "inline-flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 8,
                    }}>
                        {sortOrder === "asc" ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
                        Сортувати
                        <DownOutlined style={{ fontSize: 12 }} />
                    </Button>
                </Dropdown>
            </Flex>
            <div style={{
                display: "grid",
                gap: 'var(--gap)',
                gridTemplateColumns: 'repeat(auto-fill,minmax(153px,1fr))',
                gridAutoRows: "auto",
            }}>
                {users.map((user, i) => (
                    <UserCard key={i} user={user} />
                ))}
            </div>
        </Flex>
    );
}
