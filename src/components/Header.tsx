'use client'

import {Header} from "antd/es/layout/layout";
import Link from "next/link";
import {Avatar, Dropdown, Image, MenuProps, Space} from "antd";
import {AuthTokensService} from "@/services/auth-token.service";
import {CaretDownOutlined, UserOutlined} from "@ant-design/icons";
import { useEffect, useState } from "react";

const items: MenuProps['items'] = [
    {
        label: <Link href="/profile/subjects">Subjects</Link>,
        key: '0',
    },
    {
        label: <Link href="/profile/grades">Grades</Link>,
        key: '1',
    },
    {
        label: <Link href="/profile/achievements">Achievements</Link>,
        key: '2',
    },
    {
        label: <Link href="/profile/settings">Settings</Link>,
        key: '3',
    },
    {key: 'divider', type: 'divider'},
    {
        label: <Link style={{color: "orangered"}} onClick={() => {
            AuthTokensService.deleteAuthToken();
            window.location.href = "/";
        }} href="/">Logout</Link>,
        key: '4',
    },
]

export default function AppHeader() {
    // todo: auto updating on login/logout
    const [isLoggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
        setLoggedIn(AuthTokensService.getAuthToken() !== "");
    })
    return (
        <Header style={{
            background: "#1f1f1f", padding: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: 26,
            paddingRight: 26
        }}>
            <Link href="/">
                <Space style={{display: "flex", alignItems: "center", color: "#fff", textDecoration: "none"}}>
                    <Image src="/react.svg" alt="React logo" preview={false} style={{width: 40, height: 40}}/>
                    <h1>APPLICATION</h1>
                </Space>
            </Link>

            {isLoggedIn ?
                <Space align="baseline">
                    <Dropdown menu={{items}} trigger={["click"]}>
                        <CaretDownOutlined />
                    </Dropdown>
                    <Link href="/profile">
                        <Space>
                            <span>Account</span>
                            <Avatar shape="square" size={40} icon={<UserOutlined/>}/>
                        </Space>
                    </Link>

                </Space>

                : <div>
                <Link style={{marginRight: 15}} href="/login">Авторизація</Link>
                <Link href="/register">Реєстрація</Link>
                </div>}
        </Header>
    )
}