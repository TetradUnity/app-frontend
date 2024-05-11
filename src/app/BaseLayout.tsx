'use client'
import {ConfigProvider, Layout, theme} from "antd";
import Header from "@/components/Header";
import {AntdRegistry} from "@ant-design/nextjs-registry";

export default function BaseLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AntdRegistry>
            <ConfigProvider
                theme={{
                    algorithm: theme.darkAlgorithm,
                    token: {
                        "colorPrimary": "#5e35b1",
                        "colorInfo": "#ab7ae0",
                        "colorBgBase": "#0A0A0A",
                        "fontSize": 17,
                    },
                    hashed: false
                }}>
                <Layout style={{minHeight: '100vh', display: "flex", flexFlow: "column", gap:'var(--gap)'}}>
                    <Header />
                    <div style={{
                        maxWidth:"1200px",
                        margin: "0 auto",
                        width: "100%",
                        padding: "0 16px",
                    }}>
                        {children}
                    </div>
                </Layout>
            </ConfigProvider>
        </AntdRegistry>
    );
}