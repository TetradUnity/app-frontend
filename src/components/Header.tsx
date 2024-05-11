'use client'

import {Header} from "antd/es/layout/layout";
import Link from "next/link";
import {Avatar, Button, Dropdown, Image, MenuProps, Space} from "antd";
import {AuthTokensService} from "@/services/auth-token.service";
import {
    BookOutlined,
    IdcardOutlined,
    LogoutOutlined,
    MenuOutlined,
    RiseOutlined,
    SettingOutlined,
    StarOutlined,
    TeamOutlined,
    UserOutlined
} from "@ant-design/icons";
import {useEffect, useState} from "react";

const items: MenuProps['items'] = [
    {
        label: <Link href="/profile/subjects">Мої предмети</Link>,
        icon: <BookOutlined/>,
        key: '0',
    },
    {
        label: <Link href="/profile/grades">Оцінки</Link>,
        icon: <StarOutlined/>,
        key: '1',
    },
    {
        label: <Link href="/profile/achievements">Досягнення</Link>,
        icon: <RiseOutlined/>,
        key: '2',
    },
    {
        label: <Link href="/profile/settings">Налаштування</Link>,
        icon: <SettingOutlined/>,
        key: '3',
    },
    {key: 'divider', type: 'divider'},
    {
        label: <Link style={{color: "orangered"}} onClick={() => {
            AuthTokensService.deleteAuthToken();
            window.location.href = "/";
        }} href="/">Вихід</Link>,
        icon: <LogoutOutlined style={{color: "orangered", fontSize: "16px"}}/>,
        key: '4',
    },
]

export default function AppHeader() {
    // todo: auto updating on login/logout
    const [isLoggedIn, setLoggedIn] = useState(false)
     useEffect(() => {
         setLoggedIn(AuthTokensService.getAuthToken() !== "");
     })
    const gridTemplateColumns = isLoggedIn ? "280px 1fr 280px" : "280px 1fr";
    return (
        <Header style={{
            background: 'rgba(31,31,31,0.85)',
            padding: 0,
            display: "grid",
            gridTemplateColumns: gridTemplateColumns,
            alignItems: "center",
            lineHeight: 0,
            position: "fixed",
            width: "100%",
            zIndex: 1000,
            height: 'var(--header-height)',
            backdropFilter: "blur(10px)",
            borderBottom: "solid 1px #444",
        }}>
            <Link href="/" style={{marginLeft: 20}}>
                <Space style={{display: "flex", alignItems: "center", color: "#fff", textDecoration: "none"}}>
                    <Image src="/react.svg" alt="React logo" preview={false} style={{width: 40, height: 40}}/>
                    <h1>APPLICATION</h1>
                </Space>
            </Link>
            {isLoggedIn ?
                <Space style={{display: "flex", justifyContent: "center"}}>
                    <Button type="text" href="/subjects" icon={<BookOutlined/>}>Предмети</Button>
                    <Button type="text" href="/students" icon={<IdcardOutlined/>}>Студенти</Button>
                    <Button type="text" href="/teachers" icon={<TeamOutlined/>}>Вчителі</Button>
                </Space> : null}
            {isLoggedIn ?
                <Space align="center" style={{
                    display: "flex",
                    position: "relative",
                    justifyContent: "flex-end",
                    marginRight: 20
                }}>
                    <Link href={"/profile"}>
                        <Avatar shape="square" alt="user avatar" size={32} style={{margin:0, padding:0}} icon={<UserOutlined/>}/>
                    </Link>

                    <Dropdown menu={{items}} trigger={["click"]} overlayStyle={{paddingTop:12}}>
                        <Button type="text" icon={<MenuOutlined/>}/>
                    </Dropdown>

                </Space>

                : <Space style={{display: "flex", position: "relative", justifyContent: "flex-end", marginRight: 20}}>
                    <Link style={{marginRight: 15}} href="/login">Авторизація</Link>
                    <Link href="/register">Реєстрація</Link>
                </Space>}
        </Header>
    )
}