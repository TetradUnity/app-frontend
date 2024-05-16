'use client'

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
import { usePathname } from "next/navigation";
import {useProfileStore} from "@/stores/profileStore";

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
        label: <Link href={`/profile/${myProfileId}/settings`}>Налаштування</Link>,
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

function NavButton({path, icon, text} : {path: string, icon: React.ReactNode, text: string}) {
    const pathname = usePathname();

    return (
        <Link href={path}>
            <Button type={pathname == path ? "dashed" : "text"} icon={icon}>{text}</Button>
        </Link>
    )
}

export default function AppHeader() {
    const [isLoggedIn, setLoggedIn] = useState(false)
    const profileId = useProfileStore(store => store.id);

    useEffect(() => {
        setLoggedIn(AuthTokensService.getAuthToken() !== "");
        myProfileId = profileId;
    }, [])

    const gridTemplateColumns = isLoggedIn ? "290px 1fr 145px" : "280px 1fr";
    return (
        <div style={{
            background: 'rgba(31,31,31,0.85)',
            position: "sticky",
            top: 0,
            width: "100vw",
            zIndex: 1000,
            height: '58px',
            backdropFilter: "blur(10px)",
            borderBottom: "solid 1px #444",
        }}>
            <div style={{
                maxWidth:"1200px",
                width: "100%",
                display: "grid",
                gridTemplateColumns: gridTemplateColumns,
                alignItems: "center",
                margin: "0 auto",
                height: "100%",
            }}>
                <Link href="/" style={{marginLeft: 20}}>
                    <Space style={{display: "flex", alignItems: "center", color: "#fff", textDecoration: "none"}}>
                        <Image src="/react.svg" alt="React logo" preview={false} style={{width: 40, height: 40}}/>
                        <h1>APPLICATION</h1>
                    </Space>
                </Link>
                {isLoggedIn ?
                    <Space style={{display: "flex", justifyContent: "center"}}>
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
                    </Space> : null}
                {isLoggedIn ?
                    <Space align="center" style={{
                        display: "flex",
                        position: "relative",
                        justifyContent: "flex-end",
                        marginRight: 20
                    }}>
                        <Link href={`/profile/${myProfileId}`}>
                            <Avatar shape="square" alt="user avatar" size={32} style={{margin: 0, padding: 0}}
                                    icon={<UserOutlined/>}/>
                        </Link>

                        <Dropdown menu={{items}} trigger={["click"]} overlayStyle={{paddingTop: 12}}>
                            <Button type="text" icon={<MenuOutlined/>}/>
                        </Dropdown>

                    </Space>

                    : <Space
                        style={{display: "flex", position: "relative", justifyContent: "flex-end", padding: "10px 0"}}>
                        <Link style={{marginRight: 15}} href="/login">Авторизація</Link>
                        <Link href="/register">Реєстрація</Link>
                    </Space>}
            </div>
        </div>
    )
}