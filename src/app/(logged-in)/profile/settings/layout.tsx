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
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Link className={styles.Link + " " + (selectedLink === "/about" ? styles.isActive : "")} href="about">
                    <div className={styles.linkContent}>
                        <SolutionOutlined/>
                        Інформація
                    </div>
                </Link>
                <Link className={styles.Link + " " + (selectedLink === "/security" ? styles.isActive : "")} href="security">
                    <div className={styles.linkContent}>
                        <LockOutlined/>
                        Безпека і вхід
                    </div>
                </Link>
            </div>
            {children}
        </div>
    )
}