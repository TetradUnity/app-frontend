'use client'
import {ConfigProvider, Layout, theme} from "antd";
import Header from "@/components/Header";
import {AntdRegistry} from "@ant-design/nextjs-registry";

import locale from "antd/lib/locale/uk_UA";
import dayjs from 'dayjs';

import 'dayjs/locale/uk';

dayjs.locale('uk');

export default function BaseLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AntdRegistry>
            <ConfigProvider
                locale={locale}
                theme={{
                    algorithm: theme.darkAlgorithm,
                    token: {
                        "colorPrimary": "#5e35b1",
                        "colorInfo": "#ab7ae0",
                        "colorBgBase": "#0A0A0A",
                        "fontSize": 17,
                    },
                    components: {
                        Card: {
                            colorBgContainer: "rgb(38,38,38)",
                            actionsBg: "rgb(42,42,42)",
                            colorPrimary: "white",
                        }
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