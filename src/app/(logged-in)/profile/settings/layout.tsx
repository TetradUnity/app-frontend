'use client'

import React, {useState} from "react";
import Link from "next/link";
import styles from "./styles.module.css";
import {LockOutlined, SolutionOutlined} from "@ant-design/icons";
import {usePathname} from "next/navigation";

export default function ILayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    const pathname = usePathname();
    const [selectedLink, setSelectedLink] = useState(pathname.substring(pathname.lastIndexOf("/"), pathname.length));

    React.useEffect(() => {
        setSelectedLink(pathname.substring(pathname.lastIndexOf("/"), pathname.length));
    });

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            alignItems: "start",
            gap: "var(--gap)"
        }}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: '2px',
                position: "sticky",
                top: "calc(56px + var(--gap))",
                background: 'var(--foreground)',
                borderRadius: 8,
                padding: "12px 16px",
            }}>
                <Link className={styles.Link + " " + (selectedLink === "/about" ? styles.isActive : "")} href="profile/settings/about">
                    <div style={{
                        display: "flex",
                        gap: "var(--gap)",
                        alignItems: "center"
                    }}><SolutionOutlined/> Інформація
                    </div>
                </Link>
                <Link className={styles.Link + " " + (selectedLink === "/security" ? styles.isActive : "")} href="profile/settings/security">
                    <div style={{
                        display: "flex",
                        gap: "var(--gap)",
                        alignItems: "center"
                    }}><LockOutlined/> Безпека і вхід
                    </div>
                </Link>
            </div>
            {children}
        </div>
    )
}