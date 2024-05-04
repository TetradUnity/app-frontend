'use client'

import {Header} from "antd/es/layout/layout";
import Link from "next/link";
import {Image, Space} from "antd";
import {AuthTokensService} from "@/services/auth-token.service";

export default function AppHeader() {
    // todo: auto updating on login/logout
    const isLoggedIn = AuthTokensService.getAuthToken() !== ""

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
            {isLoggedIn ? <Link href="/account">Account</Link> : <Link href="/login">Sign in</Link>}

        </Header>
    )
}