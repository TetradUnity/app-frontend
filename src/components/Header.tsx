'use client'

import { Header } from "antd/es/layout/layout";
import Link from "next/link";

export default function AppHeader() {
    return (
        <Header style={{background: "#1f1f1f", padding: 0}}>
            <div style={{flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: 26, paddingRight: 26}}>
                <h1><Link href="/">APPLICATION</Link></h1>
                <Link href="/account">Account</Link>
            </div>
        </Header>
    )
}