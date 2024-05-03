'use client'

import {Header} from "antd/es/layout/layout";
import Link from "next/link";
import {Image} from "antd";

export default function AppHeader() {
    return (
        <Header style={{background: "#1f1f1f", padding: 0}}>
            <div style={{
                flex: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingLeft: 26,
                paddingRight: 26
            }}>
                <Link href="/" style={{display: "flex", alignItems: "center", color: "#fff", textDecoration: "none"}}>
                    <Image src="/react.svg" alt="React logo" preview={false} style={{width: 40, height: 40}}/>
                    <h1>APPLICATION</h1>
                </Link>
                <Link href="/account">Account</Link>
            </div>
        </Header>
    )
}