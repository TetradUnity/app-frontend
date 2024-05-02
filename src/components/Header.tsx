'use client'

import { theme } from "antd";
import { Header } from "antd/es/layout/layout";

export default function() {
    const {
        token: { colorBgElevated },
    } = theme.useToken();

    return (
        <Header style={{background: colorBgElevated, padding: 0}}>
            <h1 style={{marginLeft: 26}}>APPLICATION</h1>
        </Header>
    )
}