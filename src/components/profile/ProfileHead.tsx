'use client'
import {Avatar, Button, Flex, Space} from "antd";
import {SettingOutlined, UserOutlined} from "@ant-design/icons";
import Link from "next/link";
import {useState} from "react";
import "./page.css";
import { useQueryProfileStore } from "@/stores/queryProfileStore";

export default function ProfileHead() {
    const [selectedLink, setSelectedLink] = useState("/profile/subjects");
    const profile = useQueryProfileStore();

    const handleLinkClick = (link: string) => {
        setSelectedLink(link);
    }

    return (
        <>
            <Space direction="vertical" style={{display: "flex", background: "var(--foreground)", borderRadius: 8}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px"}}>
                    <Flex gap='var(--gap)' align="center">
                        <Avatar shape="square" size={50} icon={<UserOutlined/>}/>
                        <div>
                            <strong>{profile.first_name + " " + profile.last_name}</strong>
                            <p>{profile.role}</p>
                        </div>
                    </Flex>
                    {profile.isMe &&
                    <Link href="/profile/settings">
                        <Button type="text" icon={<SettingOutlined />} style={{padding:"0 8px", display:"flex", alignItems:"center"}}>Settings</Button>
                    </Link>}
                </div>
                <div style={{
                    display: "flex",
                    padding: "0 16px",
                    borderTop: "solid #444 1px",
                    gap: "var(--gap)",
                    whiteSpace: "nowrap",
                    alignItems: "center"
                }}>
                    <Link href={"/profile/"+profile.id+"/subjects"} className={"link-head-profile" + (selectedLink === "/profile/subjects" ? " is-active" : "")} onClick={() => handleLinkClick("/profile/subjects")}>Subjects</Link>
                    {profile.isMe && <Link href={"/profile/"+profile.id+"/grades"} className={"link-head-profile" + (selectedLink === "/profile/grades" ? " is-active" : "")}  onClick={() => handleLinkClick("/profile/grades")}>Grades</Link> }
                    <Link href={"/profile/"+profile.id+"/achievements"} className={"link-head-profile" + (selectedLink === "/profile/achievements" ? " is-active" : "")} onClick={() => handleLinkClick("/profile/achievements")}>Achievements</Link>
                </div>
            </Space>
        </>
    );
}