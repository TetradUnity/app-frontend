'use client'
import {Avatar, Button, Flex, Space} from "antd";
import {SettingOutlined, UserOutlined} from "@ant-design/icons";
import Link from "next/link";
import {useState} from "react";
import styles from "./styles.module.css";
import {usePathname} from "next/navigation";
import {useProfileStore} from "@/stores/profileStore";
import {useQueryProfileStore} from "@/stores/queryProfileStore";

export default function ProfileHead() {
    const pathname = usePathname();
    const [selectedLink, setSelectedLink] = useState(pathname.substring(pathname.lastIndexOf("/"), pathname.length));
    const myRole = useProfileStore(store => store.role);
    const profile = useQueryProfileStore();
    console.log(selectedLink)

    const handleLinkClick = (link: string) => {
        setSelectedLink(link);
    }

    return (
        <>
            <Space direction="vertical" style={{display: "flex", background: "var(--foreground)", borderRadius: 8}}>
                <div className={styles.Head} style={{

                }}>
                    <Flex gap='var(--gap)' align="center">
                        <Avatar shape="square" size={56} icon={<UserOutlined/>}/>
                        <div>
                            <strong>{profile.first_name + " " + profile.last_name}</strong>
                            <p style={{color: 'var(--text-secondary)'}}>{profile.role}</p>
                            {myRole === "TEACHER" || myRole === "CHIEF_TEACHER" || profile.isMe ? <p style={{color: 'var(--text-secondary)', fontSize:16}}>{profile.email}</p> : null}
                        </div>
                    </Flex>
                    {profile.isMe &&
                        <Link href="/profile/settings">
                            <Button type="text" icon={<SettingOutlined/>} style={{
                                padding: "0 8px",
                                display: "flex",
                                alignItems: "center"
                            }}>Налаштування</Button>
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
                        href={"/profile/" + profile.id}
                        className={styles.linkHeadProfile + " " + (selectedLink === "/" + profile.id ? styles.isActive : "")}
                        onClick={() => handleLinkClick("/" + profile.id)}
                    >
                        Предмети
                    </Link>
                    {profile.isMe &&
                        <Link
                            href={"/profile/" + profile.id + "/grades"}
                            className={styles.linkHeadProfile + " " + (selectedLink === "/grades" ? styles.isActive : "")}
                            onClick={() => handleLinkClick("/grades")}
                        >
                            Оцінки
                        </Link>
                    }
                    <Link
                        href={"/profile/" + profile.id + "/achievements"}
                        className={styles.linkHeadProfile + " " + (selectedLink === "/achievements" ? styles.isActive : "")}
                        onClick={() => handleLinkClick("/achievements")}
                    >
                        Досягнення
                    </Link>
                </div>
            </Space>
        </>
    );
}