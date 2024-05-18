'use client'
import {Avatar, Button, Flex, Space} from "antd";
import {SettingOutlined, UserOutlined} from "@ant-design/icons";
import Link from "next/link";
import {useState} from "react";
import styles from "./styles.module.css";
import { useQueryProfileStore } from "@/stores/queryProfileStore";
import {usePathname} from "next/navigation";

export default function ProfileHead() {
    const pathname = usePathname();
    const [selectedLink, setSelectedLink] = useState(pathname);
    const profile = useQueryProfileStore();

    const handleLinkClick = (link: string) => {
        setSelectedLink(link);
    }

    return (
        <>
            <Space direction="vertical" style={{display: "flex", background: "var(--foreground)", borderRadius: 8}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px"}}>
                    <Flex gap='var(--gap)' align="center">
                        <Avatar shape="square" size={48} icon={<UserOutlined/>}/>
                        <div>
                            <strong>{profile.first_name + " " + profile.last_name}</strong>
                            <p>{profile.role}</p>
                        </div>
                    </Flex>
                    {profile.isMe &&
                    <Link href="/profile/settings">
                        <Button type="text" icon={<SettingOutlined />} style={{padding:"0 8px", display:"flex", alignItems:"center"}}>Налаштування</Button>
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
                    <Link
                        href={"/profile/"+profile.id+"/subjects"}
                        className={styles.linkHeadProfile + " " + styles.isActive +  (selectedLink === "/profile/"+profile.id+"/grades" ? styles.isActive : "")}
                        onClick={() => handleLinkClick("/profile/"+profile.id+"/subjects")}
                    >
                        Предмети
                    </Link>
                    {profile.isMe &&
                        <Link
                            href={"/profile/"+profile.id+"/grades"}
                            className={styles.linkHeadProfile + " " + (selectedLink === "/profile/"+profile.id+"/grades" ? styles.isActive : "")}
                            onClick={() => handleLinkClick("/profile/"+profile.id+"/grades")}
                        >
                            Оцінки
                        </Link>
                    }
                    <Link
                        href={"/profile/"+profile.id+"/achievements"}
                        className={styles.linkHeadProfile + " " + (selectedLink === "/profile/"+profile.id+"/achievements" ? styles.isActive : "")}
                        onClick={() => handleLinkClick("/profile/"+profile.id+"/achievements")}
                    >
                        Досягнення
                    </Link>
                </div>
            </Space>
        </>
    );
}