'use client'
import { ConfigProvider, ThemeConfig, theme } from "antd";
import { useState } from "react";

const lightTheme: ThemeConfig = {
    algorithm: theme.defaultAlgorithm,
}

const darkTheme: ThemeConfig = {
    algorithm: theme.darkAlgorithm,
    token: {
        "colorPrimary": "#ab7ae0",
        "colorInfo": "#ab7ae0",
        "colorBgBase": "#000000",
        "fontSize": 17,
    },
    hashed: false
}

export default function({children} : {children: React.ReactNode}) {
    const [isDarkMode, setIsDarkMode] = useState(true);

    return (
        <ConfigProvider
          theme={isDarkMode ? darkTheme : lightTheme}>
          {children}
        </ConfigProvider>
    )
}