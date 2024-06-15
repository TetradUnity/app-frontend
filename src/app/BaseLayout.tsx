'use client'
import {ConfigProvider, Layout, Spin, theme} from "antd";
import Header from "@/components/Header";
import {AntdRegistry} from "@ant-design/nextjs-registry";

import locale from "antd/lib/locale/uk_UA";
import dayjs from 'dayjs';

import "dayjs/locale/uk";

import relativeTime from "dayjs/plugin/relativeTime";
import { useDeviceStore } from "@/stores/deviceStore";
import { useShallow } from "zustand/react/shallow";
import { Suspense, useEffect } from "react";
import ProgressBarProvider from "@/providers/ProgressBarProvider";
import { pdfjs } from "react-pdf";

dayjs.locale('uk');
dayjs.extend(relativeTime);

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function BaseLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const setDeviceType = useDeviceStore(useShallow(state => state.setType));

    useEffect(() => {
        function handleWindowSizeChange() {
            setDeviceType((window.innerWidth <= 768) ? "mobile" : "desktop");
        }

        handleWindowSizeChange();
        window.addEventListener('resize', handleWindowSizeChange);
        return () => window.removeEventListener('resize', handleWindowSizeChange);
    }, []);

    return (
        <AntdRegistry>
            <ConfigProvider
                locale={locale}
                theme={{
                    algorithm: theme.darkAlgorithm,
                    token: {
                        "colorPrimary": "#8458dd",
                        "colorInfo": "#ab7ae0",
                        "colorBgBase": "#0A0A0A",
                        "fontSize": 16,
                        "borderRadius": 10
                    },
                    components: {
                        Card: {
                            colorBgContainer: "rgb(38,38,38)",
                            actionsBg: "rgb(42,42,42)",
                            colorPrimary: "white",
                        },
                        Segmented: {
                            trackBg: "var(--foreground-darker)",
                            itemHoverBg: "null"
                        },
                        Calendar: {
                            colorPrimary: "#9b75e6"
                        }
                    },
                    hashed: false
                }}>
                    <Suspense fallback={<Spin spinning fullscreen />}>
                        <ProgressBarProvider>
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
                        </ProgressBarProvider>
                    </Suspense>
            </ConfigProvider>
        </AntdRegistry>
    );
}