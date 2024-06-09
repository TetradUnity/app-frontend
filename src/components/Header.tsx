'use client'

import Link from "next/link";
import {Avatar, Button, Dropdown, Image, MenuProps, Space} from "antd";
import {AuthTokensService} from "@/services/auth-token.service";
import {
    ArrowRightOutlined,
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
import {usePathname} from "next/navigation";
import {useProfileStore} from "@/stores/profileStore";
import "./header.css"

let myProfileId = -1;
const items: MenuProps['items'] = [
    {
        label: <Link href={`/profile/${myProfileId}/subjects`}>Мої предмети</Link>,
        icon: <BookOutlined/>,
        key: '0',
    },
    {
        label: <Link href={`/profile/${myProfileId}/grades`}>Оцінки</Link>,
        icon: <StarOutlined/>,
        key: '1',
    },
    {
        label: <Link href={`/profile/${myProfileId}/achievements`}>Досягнення</Link>,
        icon: <RiseOutlined/>,
        key: '2',
    },
    {
        label: <Link href={`/profile/settings`}>Налаштування</Link>,
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

function NavButton({path, icon, text}: { path: string, icon: React.ReactNode, text: string }) {
    const pathname = usePathname();

    return (
        <Link href={path}>
            <Button className="nav-button" type={pathname == path ? "dashed" : "text"} icon={icon}>{text}</Button>
        </Link>
    )
}

export default function AppHeader() {
    const [isLoggedIn, setLoggedIn] = useState(false)
    const profile = useProfileStore();


    useEffect(() => {
        setLoggedIn(AuthTokensService.getAuthToken() !== "");
    }, [])

    const items: MenuProps['items'] = [
        {
            label: (
                <Link href={`/profile/${profile.id}`} style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    flexDirection: "column",
                    flexGrow: 1,
                    flexShrink: 0,
                    maxWidth: "100%",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    marginLeft: 6,
                }}>
                    <div style={{
                        maxWidth: "70%",
                        height: "max-content",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        fontSize: 14,
                    }}>{profile.first_name}</div>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: 11,
                        color: "var(--text-secondary)"
                    }}>
                        <span>Профіль</span>
                        <ArrowRightOutlined style={{fontSize: 11, padding: 0, margin: "0 0 0 4px"}}/>
                    </div>
                </Link>
            ),
            icon: <Avatar src={profile.avatar_url} shape="square" alt="user avatar" icon={profile.avatar}/>,
            key: '0',
        },
        {key: 'divider', type: 'divider'},
        {
            label: (
                <Link href={`/profile/${profile.id}/subjects`} style={{display: "flex", alignItems: "center"}}>
                    <BookOutlined/>
                    <div style={{paddingLeft: 8}}>Мої предмети</div>
                </Link>
            ),
            key: '1',
        },
        {
            label: (
                <Link href={`/profile/${profile.id}/grades`} style={{display: "flex", alignItems: "center"}}>
                    <StarOutlined/>
                    <div style={{paddingLeft: 8}}>Оцінки</div>
                </Link>
            ),
            key: '2',
        },
        {
            label: (
                <Link href={`/profile/${profile.id}/achievements`} style={{display: "flex", alignItems: "center"}}>
                    <RiseOutlined/>
                    <div style={{paddingLeft: 8}}>Досягнення</div>
                </Link>
            ),
            key: '3',
        },
        {key: 'divider2', type: 'divider'},
        {
            label: (
                <Link href={`/profile/settings`}
                      style={{color: "var(--text-primary)", display: "flex", alignItems: "center"}}>
                    <SettingOutlined/>
                    <div style={{paddingLeft: 8}}>Налаштування</div>
                </Link>
            ),
            key: '4',
        },
        {
            label: (
                <Link
                    style={{color: "orangered", display: "flex", alignItems: "center"}}
                    onClick={() => {
                        AuthTokensService.deleteAuthToken();
                        window.location.href = "/";
                    }}
                    href="/"
                >
                    <LogoutOutlined style={{color: "orangered", fontSize: "16px"}}/>
                    <div style={{paddingLeft: 8}}>Вихід</div>
                </Link>
            ),
            key: '5',
        },


    ]
    return (
        <div style={{
            background: 'var(--header)',
            position: "sticky",
            top: 0,
            width: "100vw",
            zIndex: 1000,
            height: '58px',
            backdropFilter: "blur(10px)",
            borderBottom: "solid 1px #444",
        }}>
            <div className="header-grid">
                <Link href="/" style={{marginLeft: 20, width: "max-content"}}>
                    <Image className="logo-big" src="/logo_academy.svg" alt="Logo" preview={false} style={{height: 42}}/>
                    <Image className="logo-small" src="/logo.svg" alt="Logo" preview={false} style={{height: 42}}/>
                </Link>
                {isLoggedIn ?
                    <>
                        <div className="nav-buttons">
                            <NavButton
                                path="/subjects"
                                icon={<BookOutlined/>}
                                text="Предмети"
                            />
                            <NavButton
                                path="/students"
                                icon={<IdcardOutlined/>}
                                text="Студенти"
                            />
                            <NavButton
                                path="/teachers"
                                icon={<TeamOutlined/>}
                                text="Вчителі"
                            />
                        </div>
                        <div className="nav-buttons-short">
                            <NavButton
                                path="/subjects"
                                icon={<BookOutlined/>}
                                text=""
                            />
                            <NavButton
                                path="/students"
                                icon={<IdcardOutlined/>}
                                text=""
                            />
                            <NavButton
                                path="/teachers"
                                icon={<TeamOutlined/>}
                                text=""
                            />
                        </div>
                    </> : <div/>}
                {isLoggedIn ?
                    <Space align="center" style={{
                        display: "flex",
                        position: "relative",
                        justifyContent: "flex-end",
                    }}>
                        <Link href={`/profile/${profile.id}`}>
                            <Avatar shape="square" alt="avatar" size={32} style={{margin: 0, padding: 0}}
                                src={profile.avatar_url} icon={<UserOutlined/>}/>
                        </Link>

                        <Dropdown menu={{items}} trigger={["click"]} overlayStyle={{paddingTop: 12, minWidth: 230}}>
                            <Button type="text" icon={<MenuOutlined/>}/>
                        </Dropdown>

                    </Space> :
                    <div
                        style={{display: "flex", position: "relative", justifyContent: "flex-end", padding: "10px 0"}}>
                        <Link style={{marginRight: 15}} href="/login">Авторизація</Link>
                        <Link href="/register">Реєстрація</Link>
                    </div>}
            </div>
        </div>
    )
}