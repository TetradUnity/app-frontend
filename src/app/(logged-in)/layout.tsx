'use client'
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";

import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/stores/appStore";

export default function ILayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isLoading = useAppStore(state => state.isLoading);
  const [isAppLoading, setAppLoading] = useState(true);

  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;

      setTimeout(() => {
        setAppLoading(false);
      }, 3000);
    }
  }, []);

  return (
      <Layout>
          <Content style={{margin: "15px 16px"}}>
          {!isAppLoading ? 
            <div style={{background: "#141414", borderRadius: 10, padding: 24, minHeight: 360}}>
              {children}
            </div>
            : null}
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 60 }}/>}
            spinning={isAppLoading || isLoading}
            fullscreen
            tip={<h1>Завантаження...</h1>}
          />
          </Content>
      </Layout>
  );
}
