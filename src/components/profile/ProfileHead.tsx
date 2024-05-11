'use client'
import {Avatar, Flex, Space} from "antd";
import {UserOutlined} from "@ant-design/icons";
import Link from "next/link";
import {useState} from "react";
import { useProfileStore } from "@/stores/profileStore";

export default function ProfileHead() {
    const [selectedPage, setSelectedPage] = useState('subjects');

    const profile = useProfileStore();

    let content;
    switch (selectedPage) {
        case "subjects":
            content = <h1>Subjects</h1>;
            break;
        case "grades":
            content = <h1>Grades</h1>;
            break;
        case "achievements":
            content = <h1>Achievements</h1>;
            break;
        default:
            content = <h1>{selectedPage}</h1>;
    }

    return (
        <>
            <Space direction="vertical" style={{display: "flex", background: "#181818", borderRadius: 8}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px"}}>
                    <Flex gap={16} align="center">
                        <Avatar shape="square" size={50} icon={<UserOutlined/>}/>
                        <div>
                            <strong>{profile.first_name + " " + profile.last_name}</strong>
                            <p>{profile.role}</p>
                        </div>
                    </Flex>
                    <Link href="/profile/settings">Settings</Link>
                </div>
                <Space style={{display: "flex", padding: 8, borderTop: "solid #444 1px"}}>
                    <Link href="/profile/subjects">Subjects</Link>
                    <a onClick={() => setSelectedPage('grades')}>Grades</a>
                    <a onClick={() => setSelectedPage('achievements')}>Achievements</a>
                </Space>
            </Space>
        </>
    );
}